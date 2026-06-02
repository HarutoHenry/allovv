"use client"

import { useEffect } from "react"

export function ScrollTop() {
  useEffect(() => {
    window.history.scrollRestoration = "manual"
    window.scrollTo(0, 0)
  }, [])

  return null
}
