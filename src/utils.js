/** A.B.C... => `A.B.C...` */
export const matchPath = (obj, target) => {
  for (const key in obj) {
    if(key === target) return key;
    if(obj[key] === target) return `${key}.${target}`;
    if (obj[key] instanceof Object) {
      const result = matchPath(obj[key], target);
      if(result) {
        return `${key}.${result}`;
      }
    }
  }
  return null;
};

export const isRoute = (obj, target) => {
  if(!matchPath(obj, target)) return false;
  return true;
};
