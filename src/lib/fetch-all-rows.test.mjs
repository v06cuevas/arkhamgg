import assert from 'node:assert/strict'
import test from 'node:test'
import { fetchAllRows } from './fetch-all-rows.ts'

test('loads all 43 EOS products from an inventory larger than 1000 rows', async () => {
  const inventory = Array.from({ length: 1053 }, (_, id) => ({
    id, name: id < 7 || id >= 1017 ? 'EOS' : 'Other',
  }))
  assert.equal(inventory.slice(0, 1000).filter(p => p.name === 'EOS').length, 7)
  const result = await fetchAllRows(async (from, to) => ({
    data: inventory.slice(from, to + 1), error: null,
  }))
  assert.deepEqual(result.data, inventory)
  assert.equal(result.data.filter(p => p.name === 'EOS').length, 43)
})

test('continues when the server caps pages below the requested size', async () => {
  const inventory = Array.from({ length: 43 }, (_, id) => id)
  const result = await fetchAllRows(async (from, to) => ({
    data: inventory.slice(from, Math.min(to + 1, from + 7)), error: null,
  }))
  assert.deepEqual(result.data, inventory)
})

test('does not return a partial inventory when a later page fails', async () => {
  const failure = { message: 'Connection failed' }
  const result = await fetchAllRows(async (from) => from === 0
    ? { data: [1, 2], error: null }
    : { data: null, error: failure })
  assert.deepEqual(result, { data: null, error: failure })
})

test('handles an empty inventory', async () => {
  assert.deepEqual(await fetchAllRows(async () => ({ data: [], error: null })), {
    data: [], error: null,
  })
})
