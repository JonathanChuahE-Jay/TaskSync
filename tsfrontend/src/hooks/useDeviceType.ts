import { useEffect, useState } from 'react'

export function useDeviceType() {
    const [deviceType, setDeviceType] = useState({
        isPhone: false,
        isTablet: false,
        isPc: true,
        isIpadMini: false,
    })

    useEffect(() => {
        const smallPhoneThreshold = 384
        const phoneThreshold = 768
        const ipadMiniWidth = 768
        const tabletThreshold = 1024

        const determineDeviceType = () => {
            const width = window.innerWidth
            const userAgent = navigator.userAgent.toLowerCase()

            const isIpad = /ipad/.test(userAgent)
            const isIOS = /iphone|ipod/.test(userAgent)
            const isMacLikeIpad = !isIOS && !isIpad && 'ontouchend' in document
            const actualIpadMini = (isIpad || isMacLikeIpad) && width === ipadMiniWidth

            if (actualIpadMini) {
                setDeviceType({
                    isPhone: false,
                    isTablet: false,
                    isPc: false,
                    isIpadMini: true,
                })
            } else if (width <= smallPhoneThreshold) {
                setDeviceType({
                    isPhone: true,
                    isTablet: false,
                    isPc: false,
                    isIpadMini: false,
                })
            } else if (width <= phoneThreshold) {
                setDeviceType({
                    isPhone: true,
                    isTablet: false,
                    isPc: false,
                    isIpadMini: false,
                })
            } else if (width <= tabletThreshold) {
                setDeviceType({
                    isPhone: false,
                    isTablet: true,
                    isPc: false,
                    isIpadMini: false,
                })
            } else {
                setDeviceType({
                    isPhone: false,
                    isTablet: false,
                    isPc: true,
                    isIpadMini: false,
                })
            }
        }

        determineDeviceType()
        window.addEventListener('resize', determineDeviceType)
        return () => window.removeEventListener('resize', determineDeviceType)
    }, [])

    return deviceType
}
