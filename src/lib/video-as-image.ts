/**
 * 低電力モードの Safari（Mac も iPhone も）は、音の無い動画でも自動再生を断る。
 * play() が NotAllowedError で失敗し、クリックされるまで1コマ目で止まったままになる。
 * ただ、同じ mp4 を <img> に入れると GIF と同じ扱いで流してくれる。
 * 2026-11-25 に低電力モードの Mac で確かめた：<video> は止まったまま、<img> は動いた。
 *
 * ここではその切り替えに使う道具だけを置く。Chrome・Firefox は mp4 を画像として
 * 読めず error になるので、その時は何もせず動画のまま残す（そもそもこれらは断らない）。
 */

/** play() の失敗が「自動再生を断られた」ものか。読み込み途中の中断（AbortError）などは含めない */
export function isAutoplayRefused(error: unknown) {
  return error instanceof DOMException && error.name === "NotAllowedError"
}

/** img に動画の mp4 を画像として読ませる。読めたら onShow、読めなければ onFail。
    返す関数を呼ぶと、結果を待つのをやめる */
export function loadVideoAsImage(
  img: HTMLImageElement,
  src: string,
  onShow: () => void,
  onFail: () => void = () => {},
) {
  let settled = false
  function stop() {
    img.removeEventListener("load", onLoad)
    img.removeEventListener("error", onError)
  }
  function finish(ok: boolean) {
    if (settled) return
    settled = true
    stop()
    if (ok) onShow()
    else onFail()
  }
  function onLoad() {
    finish(img.naturalWidth > 0)
  }
  function onError() {
    finish(false)
  }
  img.addEventListener("load", onLoad)
  img.addEventListener("error", onError)
  img.src = src
  return () => {
    settled = true
    stop()
  }
}
