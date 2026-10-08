import 'package:flutter_tdd/core/http/models/result.dart';
import 'package:flutter_tdd/features/request/domain/models/create_request_domain_model.dart';

abstract class RequestRepository {
  Future<MyResult<CreateRequestPreviewDomainModel>> getCreatePreview();
}
