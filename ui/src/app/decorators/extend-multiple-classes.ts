
export function ExtendMultipleClasses (opts: { classes: any[] }) {
  return (baseClass: any) => {
    opts.classes.forEach(extendedClass => {
      Object.getOwnPropertyNames(extendedClass.prototype).forEach(name => {
        if (name !== 'constructor') {
          baseClass.prototype[name] = extendedClass.prototype[name]
        }
      })
    })
    return baseClass
  }
}
