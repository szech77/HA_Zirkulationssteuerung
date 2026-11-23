import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync, readFileSync, realpathSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { createRequire } from 'node:module'
import WarmwasserDashboard from '../components/WarmwasserDashboard.vue'
import { createPanelRouter } from '../router'
import { entry } from './fixtures'

const require = createRequire(import.meta.url)

describe('updated formatter dependency compatibility', () => {
  it('serializes actual Vue component HTML through the js-beautify integration', () => {
    const wrapper = mount(WarmwasserDashboard, { props: { entry: entry() }, global: { plugins: [createPanelRouter()] } })
    const html = wrapper.html()
    expect(html).toContain('<article')
    expect(html).toContain('Test-Zirkulation')
    expect(wrapper.text()).toContain('45,2°C')
    wrapper.unmount()
  })

  it('expands file patterns and applies EditorConfig indentation with patched glob/minimatch', () => {
    const directory = mkdtempSync(join(tmpdir(), 'warmwasser-formatter-'))
    try {
      writeFileSync(join(directory, '.editorconfig'), 'root = true\n\n[*.html]\nindent_style = space\nindent_size = 2\n', 'utf8')
      writeFileSync(join(directory, 'sample.html'), '<section><div>Formatter test</div></section>', 'utf8')
      writeFileSync(join(directory, 'ignore.txt'), 'not an HTML input', 'utf8')
      const fromTestUtils = createRequire(require.resolve('@vue/test-utils'))
      const formatter = dirname(fromTestUtils.resolve('js-beautify/package.json'))
      const output = execFileSync(process.execPath, [join(formatter, 'js/bin/html-beautify.js'), '--editorconfig', '--files', '*.html'], { cwd: directory, encoding: 'utf8', timeout: 10_000 })
      expect(output).toContain('sample.html')
      expect(readFileSync(join(directory, 'sample.html'), 'utf8')).toMatch(/\n {2}<div>Formatter test<\/div>/)
      expect(readFileSync(join(directory, 'ignore.txt'), 'utf8')).toBe('not an HTML input')
    } finally {
      // Only remove the disposable directory created by this test.
      const target = realpathSync(directory)
      if (dirname(target) !== realpathSync(tmpdir()) || !basename(target).startsWith('warmwasser-formatter-')) throw new Error('Unexpected test directory')
      rmSync(target, { recursive: true, force: true })
    }
  })
})
