import crypto from 'crypto';
import { db } from '../db/database';
import { notificationService } from './notificationService';

export interface SmsMessageRecord {
  id: string;
  recipientPhone: string;
  recipientRole: 'DRIVER' | 'DIVE_INSTRUCTOR' | 'HOTEL_DESK' | 'TRAVELER' | 'BEDOUIN_GUIDE';
  recipientName: string;
  message: string;
  channel: 'TWILIO_SMS' | 'WHATSAPP_BUSINESS';
  status: 'DELIVERED' | 'SENT' | 'QUEUED' | 'SIMULATED';
  /**
   * True when no provider accepted the message. A SIMULATED record never left
   * this server: without Twilio credentials there is no gateway, only this
   * log. Ops surfaces must render these as "not sent", never as delivered.
   */
  simulated: boolean;
  /** Provider error when a configured Twilio call failed (undefined otherwise). */
  providerError?: string;
  referenceBookingId?: string;
  providerMessageSid?: string;
  timestamp: string;
}

// In-memory persistent SMS dispatch log.
//
// The two seed rows below are DEMONSTRATION data for a fresh boot, not proof
// of delivery. They carry status SIMULATED + simulated:true so no dashboard
// can mistake them for dispatches that reached a phone.
export const smsDispatchLogs: SmsMessageRecord[] = [
  {
    id: 'SMS-INIT-001',
    recipientPhone: '+20 100 876 5432',
    recipientRole: 'DRIVER',
    recipientName: 'Mahmoud Salem (Driver)',
    message: 'Dahab Ride: New Transfer! Flight MS-028 (SSH T1). Traveler: Ahmed Mansour (2 pax). Pickup today 10:30 AM.',
    channel: 'TWILIO_SMS',
    status: 'SIMULATED',
    simulated: true,
    referenceBookingId: 'DHB-TRF-001',
    providerMessageSid: 'SIMULATED',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'SMS-INIT-002',
    recipientPhone: '+20 101 445 6677',
    recipientRole: 'DIVE_INSTRUCTOR',
    recipientName: 'Omar Soliman (PADI MSDT)',
    message: 'Dahab Dive Alert: Canyon & LightHouse guided dive booked for tomorrow 08:30 AM (2 divers). VCH-DIV-894',
    channel: 'TWILIO_SMS',
    status: 'SIMULATED',
    simulated: true,
    referenceBookingId: 'DHB-DIV-001',
    providerMessageSid: 'SIMULATED',
    timestamp: new Date(Date.now() - 1800000).toISOString()
  }
];

export class SmsGatewayService {
  /**
   * Dispatches an SMS alert via Twilio REST API if credentials exist.
   *
   * Honesty contract (the whole point of this service's status field):
   * - Twilio accepts (2xx + sid) → SENT, simulated:false. "Accepted by the
   *   provider" is all a synchronous call can claim; delivery is unknown.
   * - Anything else → SIMULATED, simulated:true. The message never left this
   *   server, including the no-credentials path (there is no local gateway,
   *   only this log) and the Twilio-failure path (a failed POST is not a send).
   */
  public async sendSms(params: {
    to: string;
    recipientName: string;
    recipientRole: SmsMessageRecord['recipientRole'];
    message: string;
    bookingRef?: string;
    channel?: 'TWILIO_SMS' | 'WHATSAPP_BUSINESS';
    /**
     * Who the notification record belongs to when the recipient is a traveler.
     * Without it every traveler-bound SMS was filed against 'USR-AHMED-01'.
     */
    recipientUserId?: string;
  }): Promise<SmsMessageRecord> {
    const id = `SMS-${Date.now()}-${crypto.randomBytes(2).toString('hex').toUpperCase()}`;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER || '+12055550199';

    let status: SmsMessageRecord['status'] = 'SIMULATED';
    let simulated = true;
    let providerError: string | undefined;
    let providerMessageSid = 'SIMULATED';

    if (accountSid && authToken && fromPhone) {
      try {
        // Direct lightweight Twilio REST API invocation without heavy SDK overhead
        const endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
        const authHeader = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
        const formParams = new URLSearchParams();
        formParams.append('To', params.to);
        formParams.append('From', fromPhone);
        formParams.append('Body', params.message);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            Authorization: `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formParams.toString()
        });

        if (response.ok) {
          const data: any = await response.json();
          providerMessageSid = data.sid || `SM_UNPARSED_${crypto.randomBytes(6).toString('hex')}`;
          status = 'SENT';
          simulated = false;
          console.log(`[Twilio SMS Sent Successfully] SID: ${providerMessageSid} to ${params.to}`);
        } else {
          providerError = `Twilio API returned ${response.status}`;
          console.warn(`[${providerError}] Message ${id} recorded as SIMULATED, not sent`);
        }
      } catch (err: any) {
        providerError = `Twilio network exception: ${err?.message || err}`;
        console.warn(`[${providerError}] Message ${id} recorded as SIMULATED, not sent`);
      }
    } else {
      console.log(`[SMS simulated — no Twilio credentials] To: ${params.to} (${params.recipientRole}) -> "${params.message}"`);
    }

    const record: SmsMessageRecord = {
      id,
      recipientPhone: params.to,
      recipientRole: params.recipientRole,
      recipientName: params.recipientName,
      message: params.message,
      channel: params.channel || 'TWILIO_SMS',
      status,
      simulated,
      ...(providerError ? { providerError } : {}),
      referenceBookingId: params.bookingRef,
      providerMessageSid,
      timestamp: new Date().toISOString()
    };

    smsDispatchLogs.unshift(record);

    // Also link to unified notification service and audit log
    notificationService.sendNotification({
      // Was 'USR-AHMED-01' for every traveler-bound SMS.
      userId: params.recipientRole === 'TRAVELER' ? params.recipientUserId || 'UNATTRIBUTED' : 'ALL',
      type: 'DISPATCH_UPDATE',
      title: `SMS Broadcast (${params.recipientRole})`,
      message: params.message,
      channel: 'SMS',
      metadata: { smsId: record.id, to: params.to, sid: providerMessageSid, simulated }
    });

    db.logAudit(params.recipientName, 'Supplier', 'SMS_ALERT_DISPATCHED', 'SmsGateway', record.id, {
      to: params.to,
      role: params.recipientRole,
      bookingRef: params.bookingRef
    });

    return record;
  }

  public getRecentLogs(limit = 30): SmsMessageRecord[] {
    return smsDispatchLogs.slice(0, limit);
  }

  /**
   * Helper to dispatch simultaneous notifications to all relevant suppliers
   * (Driver, Dive Master, Hotel Reception, and Traveler) upon booking confirmation.
   */
  public async dispatchTripBookingSmsSuite(params: {
    travelerName: string;
    travelerPhone: string;
    bookingRef: string;
    hotelName?: string;
    hasTransfer?: boolean;
    hasDiving?: boolean;
    hasSafari?: boolean;
  }) {
    const promises: Promise<any>[] = [];

    // 1. SMS to Driver
    if (params.hasTransfer) {
      promises.push(
        this.sendSms({
          to: '+20 100 876 5432',
          recipientName: 'Mahmoud Salem (Airport Van)',
          recipientRole: 'DRIVER',
          bookingRef: params.bookingRef,
          message: `🚨 Dahab Shuttle: Confirmed Transfer for ${params.travelerName} (${params.travelerPhone}). Dropoff: ${params.hotelName || 'Dahab'}. Ref: ${params.bookingRef}`
        })
      );
    }

    // 2. SMS to Dive Center
    if (params.hasDiving) {
      promises.push(
        this.sendSms({
          to: '+20 101 445 6677',
          recipientName: 'Omar Soliman (Dive Instructor)',
          recipientRole: 'DIVE_INSTRUCTOR',
          bookingRef: params.bookingRef,
          message: `🤿 Dahab Dive Master: New Canyon Reef Guided Session for ${params.travelerName}. VCH: ${params.bookingRef}. Equipment & tank holds reserved.`
        })
      );
    }

    // 3. SMS to Traveler
    promises.push(
      this.sendSms({
        to: params.travelerPhone || '+20 100 123 4567',
        recipientName: params.travelerName,
        recipientRole: 'TRAVELER',
        bookingRef: params.bookingRef,
        message: `🌴 Dahab Travel: Your Sinai trip is 100% confirmed! Ref: ${params.bookingRef}. Driver assigned & Digital Pass ready at: https://dahab.travel/pass`
      })
    );

    return Promise.all(promises);
  }
}

export const smsGatewayService = new SmsGatewayService();
