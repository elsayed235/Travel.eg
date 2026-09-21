import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/correlationMiddleware';
import { fetchPriceComparison } from '../services/priceComparisonService';

export const priceComparisonRouter = Router();

/**
 * POST /api/price-comparison
 *
 * Compare prices for a specific accommodation across multiple platforms.
 * Request Body:
 * {
 *   accommodationId: string,
 *   accommodationName: string,
 *   accommodationNameAr?: string,
 *   checkIn: string (YYYY-MM-DD),
 *   checkOut: string (YYYY-MM-DD),
 *   guests: number,
 *   rooms: number
 * }
 *
 * Response:
 * {
 *   quotes: PriceQuote[],
 *   cheapestQuote: PriceQuote | null,
 *   averagePrice: number,
 *   lastUpdated: string
 * }
 */
priceComparisonRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      accommodationId,
      accommodationName,
      accommodationNameAr,
      checkIn,
      checkOut,
      guests = 1,
      rooms = 1,
    } = req.body;

    if (!accommodationId || !accommodationName || !checkIn || !checkOut) {
      return res.status(400).json({
        error: 'Missing required fields: accommodationId, accommodationName, checkIn, checkOut',
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ error: 'Check-out must be after check-in' });
    }

    const result = await fetchPriceComparison(
      {
        accommodationId,
        accommodationName,
        accommodationNameAr,
        checkIn,
        checkOut,
        guests,
        rooms,
      },
      (req.body.propertyType as string) || 'hotel'
    );

    res.json(result);
  } catch (error) {
    console.error('Price comparison error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/price-comparison/available-platforms
 */
priceComparisonRouter.get('/available-platforms', (_req: AuthenticatedRequest, res: Response) => {
  const platforms = [
    { id: 'booking_com', name: 'Booking.com', logo: '/images/platforms/booking.svg', supportedTypes: ['hotel', 'hostel', 'apartment', 'villa', 'guesthouse', 'camp', 'eco-lodge', 'boutique-hotel', 'resort', 'chalet'] },
    { id: 'expedia', name: 'Expedia', logo: '/images/platforms/expedia.svg', supportedTypes: ['hotel', 'hostel', 'apartment', 'villa', 'guesthouse', 'camp', 'eco-lodge', 'boutique-hotel', 'resort', 'chalet'] },
    { id: 'hotels_com', name: 'Hotels.com', logo: '/images/platforms/hotels.svg', supportedTypes: ['hotel', 'resort', 'boutique-hotel'] },
    { id: 'airbnb', name: 'Airbnb', logo: '/images/platforms/airbnb.svg', supportedTypes: ['apartment', 'studio', 'villa', 'guesthouse', 'camp', 'eco-lodge', 'chalet'] },
    { id: 'hostelworld', name: 'Hostelworld', logo: '/images/platforms/hostelworld.svg', supportedTypes: ['hostel'] },
  ];
  res.json({ platforms });
});

export default priceComparisonRouter;
