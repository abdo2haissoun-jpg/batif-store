import { cookies } from 'next/headers'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

type QueryResult<T = any> = { data: T | null; error: { message: string } | null; count?: number | null }

class QueryBuilder {
  private url: string
  private headers: Record<string, string>
  private table: string
  private filters: string[] = []
  private orderClause = ''
  private limitVal: number | null = null
  private selectClause = '*'
  private headOnly = false

  constructor(url: string, headers: Record<string, string>, table: string) {
    this.url = url
    this.headers = headers
    this.table = table
  }

  // Chainable filter methods (must be called BEFORE terminal methods)
  select(cols: string, opts?: { count?: string; head?: boolean }) {
    this.selectClause = cols
    if (opts?.head) this.headOnly = true
    return this
  }
  eq(col: string, val: any) { this.filters.push(`${col}=eq.${val}`); return this }
  neq(col: string, val: any) { this.filters.push(`${col}=neq.${val}`); return this }
  gte(col: string, val: any) { this.filters.push(`${col}=gte.${val}`); return this }
  lte(col: string, val: any) { this.filters.push(`${col}=lte.${val}`); return this }
  in(col: string, vals: any[]) { this.filters.push(`${col}=in.(${vals.join(',')})`); return this }
  order(col: string, opts?: { ascending?: boolean }) {
    this.orderClause = `order=${col}.${opts?.ascending !== false ? 'asc' : 'desc'}`
    return this
  }
  limit(n: number) { this.limitVal = n; return this }
  single() { this.limitVal = 1; return this }

  private buildFilterUrl() {
    let url = `${this.url}/rest/v1/${this.table}`
    if (this.filters.length) url += '?' + this.filters.join('&')
    return url
  }

  private buildSelectUrl() {
    let url = `${this.url}/rest/v1/${this.table}?select=${this.selectClause}`
    if (this.filters.length) url += '&' + this.filters.join('&')
    if (this.orderClause) url += '&' + this.orderClause
    if (this.headOnly) {
      url += '&limit=0'
    } else if (this.limitVal !== null) {
      url += `&limit=${this.limitVal}`
    }
    return url
  }

  // Terminal method: await supabase.from('t').select('*').eq('id', x)
  async then(resolve: any, reject?: any): Promise<any> {
    try {
      const url = this.buildSelectUrl()
      const res = await fetch(url, { headers: this.headers })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: res.statusText }))
        const result: QueryResult = { data: null, error: { message: err.message || err.error || res.statusText } }
        return resolve ? resolve(result) : result
      }
      if (this.headOnly) {
        const count = parseInt(res.headers.get('content-range')?.split('/')[1] || '0')
        return resolve ? resolve({ data: null, error: null, count }) : { data: null, error: null, count }
      }
      let data = await res.json()
      if (this.limitVal === 1) {
        data = data?.[0] || null
        if (!data) return resolve ? resolve({ data: null, error: { message: 'Row not found' } }) : { data: null, error: { message: 'Row not found' } }
      }
      const result: QueryResult = { data, error: null }
      return resolve ? resolve(result) : result
    } catch (err: any) {
      const result: QueryResult = { data: null, error: { message: err.message } }
      return resolve ? resolve(result) : result
    }
  }

  // Terminal: insert data
  async insert(rows: any | any[]): Promise<QueryResult> {
    const body = Array.isArray(rows) ? rows : [rows]
    try {
      const res = await fetch(`${this.url}/rest/v1/${this.table}`, {
        method: 'POST',
        headers: { ...this.headers, 'Prefer': 'return=representation' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        return { data: null, error: { message: errData.message || errData.error_description || errData.msg || res.statusText } }
      }
      const text = await res.text()
      if (!text || text.trim() === '') return { data: body.length === 1 ? body[0] : body, error: null }
      const data = JSON.parse(text)
      return { data: Array.isArray(data) && data.length === 1 ? data[0] : data, error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message } }
    }
  }

  // Terminal: update rows matching current filters
  async update(updates: Record<string, any>): Promise<QueryResult> {
    try {
      const url = this.buildFilterUrl()
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { ...this.headers, 'Prefer': 'return=representation' },
        body: JSON.stringify(updates),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        return { data: null, error: { message: errData.message || res.statusText } }
      }
      const text = await res.text()
      if (!text || text.trim() === '') return { data: null, error: null }
      const data = JSON.parse(text)
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message } }
    }
  }

  // Terminal: delete rows matching current filters
  async delete(): Promise<QueryResult> {
    try {
      const url = this.buildFilterUrl()
      const res = await fetch(url, { method: 'DELETE', headers: this.headers })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        return { data: null, error: { message: errData.message || res.statusText } }
      }
      return { data: null, error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message } }
    }
  }

  // Terminal: upsert
  async upsert(rows: any | any[]): Promise<QueryResult> {
    const body = Array.isArray(rows) ? rows : [rows]
    try {
      const res = await fetch(`${this.url}/rest/v1/${this.table}`, {
        method: 'POST',
        headers: { ...this.headers, 'Prefer': 'return=representation,resolution=merge-duplicates' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}))
        return { data: null, error: { message: errData.message || res.statusText } }
      }
      const text = await res.text()
      if (!text || text.trim() === '') return { data: body.length === 1 ? body[0] : body, error: null }
      const data = JSON.parse(text)
      return { data: Array.isArray(data) && data.length === 1 ? data[0] : data, error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message } }
    }
  }
}

export class SupabaseRestClient {
  private url: string
  private apiKey: string
  private accessToken: string | null

  constructor(url: string, apiKey: string, accessToken?: string | null) {
    this.url = url
    this.apiKey = apiKey
    this.accessToken = accessToken || null
  }

  private getHeaders() {
    const h: Record<string, string> = { 'apikey': this.apiKey, 'Content-Type': 'application/json' }
    if (this.accessToken) h['Authorization'] = `Bearer ${this.accessToken}`
    return h
  }

  async getUser() {
    if (!this.accessToken) return { data: { user: null }, error: { message: 'No token' } }
    try {
      const res = await fetch(`${this.url}/auth/v1/user`, {
        headers: { 'apikey': this.apiKey, 'Authorization': `Bearer ${this.accessToken}` },
      })
      if (!res.ok) return { data: { user: null }, error: { message: 'Unauthorized' } }
      const data = await res.json()
      return { data: { user: data }, error: null }
    } catch {
      return { data: { user: null }, error: { message: 'Network error' } }
    }
  }

  from(table: string) {
    return new QueryBuilder(this.url, this.getHeaders(), table)
  }

  async rpc(fn: string, params?: Record<string, any>) {
    try {
      const res = await fetch(`${this.url}/rest/v1/rpc/${fn}`, {
        method: 'POST', headers: this.getHeaders(), body: params ? JSON.stringify(params) : '{}',
      })
      const data = await res.json()
      if (!res.ok) return { data: null, error: { message: data.message || data.error || 'RPC failed' } }
      return { data, error: null }
    } catch (err: any) {
      return { data: null, error: { message: err.message } }
    }
  }
}

export async function createClient() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('sb-access-token')?.value || null
  return new SupabaseRestClient(SUPABASE_URL, ANON_KEY, accessToken || SERVICE_ROLE_KEY)
}

export function createServiceClient() {
  return new SupabaseRestClient(SUPABASE_URL, SERVICE_ROLE_KEY, SERVICE_ROLE_KEY)
}
