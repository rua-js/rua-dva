export default interface Action
{
  [key: string]: (payload?: any, extra?: any) => any
}
