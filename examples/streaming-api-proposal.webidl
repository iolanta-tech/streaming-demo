typedef (JsonLdRecord or sequence<JsonLdRecord>)? JsonLdDocument;
typedef (USVString or sequence<JsonLdDocument>) JsonLdStreamInput;
[Exposed=JsonLd]
interface ExpandedDocumentStream {
  async_iterable<sequence<JsonLdRecord>>;
};
partial interface JsonLdProcessor {
  static ExpandedDocumentStream expandStream(
    JsonLdStreamInput input,
    optional JsonLdOptions options = {});
};
