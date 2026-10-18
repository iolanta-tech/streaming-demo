typedef record<USVString, any> JsonLdRecord;
partial interface JsonLdProcessor {
  static Promise<sequence<JsonLdRecord>> expand(
    JsonLdInput input, optional JsonLdOptions options = {});
};

