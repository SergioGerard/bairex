import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [isInitialized, setIsInitialized] = React.useState(false)

  React.useEffect(() => {
    const checkIsMobile = () => {
      return window.innerWidth < MOBILE_BREAKPOINT
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(checkIsMobile())
    }
    
    // Inicializar inmediatamente
    setIsMobile(checkIsMobile())
    setIsInitialized(true)
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  // Durante SSR o antes de la inicialización, asumir desktop para evitar hidration mismatch
  if (!isInitialized) {
    return false
  }

  return !!isMobile
}
