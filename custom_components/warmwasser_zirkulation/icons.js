// Native HA icon API. Loaded globally so the sidebar works before opening the panel.
// Vector source: frontend/src/assets/images/sidebar.svg. No state, authentication or network access.
const circulation = Object.freeze({
  path: 'M17 94 C36 28 100 1 155 19 C189 30 212 55 223 79 L235 62 L231 107 L195 76 L205 79 C194 59 174 44 149 37 C99 20 51 44 35 99 C32 110 14 104 17 94 Z M239 162 C220 228 156 255 101 237 C67 226 44 201 33 177 L21 194 L25 149 L61 180 L51 177 C62 197 82 212 107 219 C157 236 205 212 221 157 C224 146 242 152 239 162 Z',
  secondaryPath: 'M128 60 C120 80 85 119 85 144 C85 168 104 187 128 187 C152 187 171 168 171 144 C171 119 136 80 128 60 Z',
  viewBox: '0 0 256 256',
});
window.customIcons ??= {};
window.customIcons.warmwasser = {
  getIcon: async (name) => name === 'circulation' ? { ...circulation } : { path: '' },
  getIconList: async () => [{ name: 'circulation', keywords: ['Warmwasser', 'Zirkulation'] }],
};
