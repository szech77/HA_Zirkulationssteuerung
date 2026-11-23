import { afterEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { useHomeAssistantPanel } from './useHomeAssistantPanel'
import { entry } from '../test/fixtures'

const active:ReturnType<typeof useHomeAssistantPanel>[]=[]
afterEach(()=>{for(const panel of active) panel.disconnect();active.length=0;vi.useRealTimers()})
function panel(){const value=useHomeAssistantPanel();active.push(value);return value}

describe('HA connection composable', () => {
  it('waits for the authenticated HA connection and stops polling on disconnect', async () => {
    vi.useFakeTimers()
    const connection=panel();connection.connect()
    const callWS=vi.fn().mockResolvedValue({entries:[entry()]})
    connection.setHass({callWS});await flushPromises()
    expect(callWS).toHaveBeenCalledTimes(1)
    expect(connection.state.entries[0].entry_id).toBe('synthetic-entry')
    connection.disconnect();await vi.advanceTimersByTimeAsync(30_000)
    expect(callWS).toHaveBeenCalledTimes(1)
  })
  it('ignores an old command result after reconnection and preserves the new instance state', async () => {
    let finish:(value:unknown)=>void=()=>{}
    const connection=panel()
    const oldWS=vi.fn().mockResolvedValueOnce({entries:[entry()]}).mockImplementationOnce(()=>new Promise(resolve=>{finish=resolve}))
    connection.setHass({callWS:oldWS});connection.connect();await flushPromises()
    const command=connection.importHistory('synthetic-entry').catch(error=>error.message)
    connection.disconnect()
    const updated=entry();updated.title='New synthetic connection'
    const nextWS=vi.fn().mockResolvedValue({entries:[updated]})
    connection.setHass({callWS:nextWS});connection.connect();await flushPromises()
    finish({started:true});expect(await command).toBe('unavailable')
    expect(oldWS).toHaveBeenCalledTimes(2)
    expect(connection.state.entries[0].title).toBe('New synthetic connection')
    expect(nextWS).toHaveBeenCalledTimes(1)
  })
})
