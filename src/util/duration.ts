const duration = {
  s: (str: string) => parseInt(str),
  m: (str: string) => parseInt(str) * 60,
  h: (str: string) => parseInt(str) * 60 * 60,
  d: (str: string) => parseInt(str) * 60 * 60 * 24,
};

export default duration;