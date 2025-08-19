<template>
  <main class="world-stats">
    <h1>World Stats</h1>

    <!-- Tablo -->
    <table>
      <thead>
        <tr>
          <th>Flag</th>
          <th @click="setSort('country_name')">
            Country
            <span v-if="sortBy === 'country_name'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="setSort('area_km2')">
            Area (km²)
            <span v-if="sortBy === 'area_km2'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
          </th>
          <th @click="setSort('population')">
            Population
            <span v-if="sortBy === 'population'">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="country in countries" :key="country.id">
          <td>
            <img :src="country.flag_url" alt="" width="30" />
          </td>
          <td>{{ country.country_name }}</td>
          <td>{{ formatNumber(country.area_km2) }}</td>
          <td>{{ formatNumber(country.population) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Sayfalama -->
    <div class="pagination">
      <button :disabled="page === 1" @click="prevPage">Prev</button>
      <span>Page {{ page }}</span>
      <button :disabled="countries.length < pageSize" @click="nextPage">Next</button>
    </div>
  </main>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import { createClient } from '@supabase/supabase-js'

// 🔹 Supabase client (ENV’den)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// tablo verisi
const countries = ref([])

// sıralama (schema alan adlarıyla)
const sortBy = ref('country_name') // 'country_name' | 'area_km2' | 'population'
const sortDir = ref('asc')

// sayfalama
const page = ref(1)
const pageSize = 20

// sayı biçimlendirici (Supabase numeric/string gelebilir)
function formatNumber(val) {
  const n = typeof val === 'number' ? val : Number(val)
  return Number.isFinite(n) ? n.toLocaleString() : val
}

// veri çek
async function loadData() {
  const from = (page.value - 1) * pageSize
  const to = from + pageSize - 1

  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order(sortBy.value, { ascending: sortDir.value === 'asc' })
    .range(from, to)

  if (error) {
    console.error(error)
    return
  }
  countries.value = data ?? []
}

// sıralama değiştirme
function setSort(field) {
  if (sortBy.value === field) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = field
    sortDir.value = 'asc'
  }
  loadData()
}

function nextPage() {
  page.value++
  loadData()
}

function prevPage() {
  if (page.value > 1) {
    page.value--
    loadData()
  }
}

// otomatik yükle
watchEffect(() => {
  loadData()
})
</script>

<style scoped>
.world-stats {
  padding: 2rem;
}
h1 {
  margin-bottom: 1rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th {
  cursor: pointer;
  text-align: left;
  padding: 0.5rem;
  background: #f1f5f9;
}
td {
  padding: 0.5rem;
  border-top: 1px solid #ddd;
}
.pagination {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
