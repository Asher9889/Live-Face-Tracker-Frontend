export type WSIncomingMessage<TType extends string, TPayload> = {
  type: TType;
  payload: TPayload;
};
