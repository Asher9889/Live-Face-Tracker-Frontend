export type WSIncomingMessage<TType extends string, TPayload> = {
  type: TType;
  event?: string; // Optional event field for further categorization
  payload: TPayload;
};
