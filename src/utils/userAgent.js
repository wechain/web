export function isPrerenderer() {
  return !!navigator.userAgent.match(/Prerender/);
}
