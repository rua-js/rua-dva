export default interface Actions {
  [key: string]: (payload: object, extra: object) => any
}