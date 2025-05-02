export function cn(...classes) {
    return classes.flatMap(cls => {
        if (typeof cls === 'string') return cls;
        if (typeof cls === 'object' && cls !== null) {
          return Object.entries(cls)
            .filter(([_, value]) => Boolean(value))
            .map(([key]) => key);
        }
        return [];
    }).join(' ');
}