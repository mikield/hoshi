<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronsUpDown, Check } from 'lucide-vue-next'
import { cn } from '../lib/utils'
import Popover from './Popover.vue'
import PopoverTrigger from './PopoverTrigger.vue'
import PopoverContent from './PopoverContent.vue'
import Command from './Command.vue'
import CommandInput from './CommandInput.vue'
import CommandList from './CommandList.vue'
import CommandEmpty from './CommandEmpty.vue'
import CommandGroup from './CommandGroup.vue'
import CommandItem from './CommandItem.vue'
import ScrollArea from './ScrollArea.vue'

// ── Country data ────────────────────────────────────────────────────────
interface Country {
  code: string
  name: string
  dial: string
  flag: string
}

const COUNTRIES: Country[] = [
  { code: 'US', name: 'United States',    dial: '+1',   flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom',   dial: '+44',  flag: '🇬🇧' },
  { code: 'CA', name: 'Canada',           dial: '+1',   flag: '🇨🇦' },
  { code: 'AU', name: 'Australia',        dial: '+61',  flag: '🇦🇺' },
  { code: 'DE', name: 'Germany',          dial: '+49',  flag: '🇩🇪' },
  { code: 'FR', name: 'France',           dial: '+33',  flag: '🇫🇷' },
  { code: 'ES', name: 'Spain',            dial: '+34',  flag: '🇪🇸' },
  { code: 'IT', name: 'Italy',            dial: '+39',  flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands',      dial: '+31',  flag: '🇳🇱' },
  { code: 'BE', name: 'Belgium',          dial: '+32',  flag: '🇧🇪' },
  { code: 'AT', name: 'Austria',          dial: '+43',  flag: '🇦🇹' },
  { code: 'CH', name: 'Switzerland',      dial: '+41',  flag: '🇨🇭' },
  { code: 'SE', name: 'Sweden',           dial: '+46',  flag: '🇸🇪' },
  { code: 'DK', name: 'Denmark',          dial: '+45',  flag: '🇩🇰' },
  { code: 'NO', name: 'Norway',           dial: '+47',  flag: '🇳🇴' },
  { code: 'FI', name: 'Finland',          dial: '+358', flag: '🇫🇮' },
  { code: 'PL', name: 'Poland',           dial: '+48',  flag: '🇵🇱' },
  { code: 'CZ', name: 'Czech Republic',   dial: '+420', flag: '🇨🇿' },
  { code: 'HU', name: 'Hungary',          dial: '+36',  flag: '🇭🇺' },
  { code: 'GR', name: 'Greece',           dial: '+30',  flag: '🇬🇷' },
  { code: 'PT', name: 'Portugal',         dial: '+351', flag: '🇵🇹' },
  { code: 'IE', name: 'Ireland',          dial: '+353', flag: '🇮🇪' },
  { code: 'JP', name: 'Japan',            dial: '+81',  flag: '🇯🇵' },
  { code: 'CN', name: 'China',            dial: '+86',  flag: '🇨🇳' },
  { code: 'HK', name: 'Hong Kong',        dial: '+852', flag: '🇭🇰' },
  { code: 'SG', name: 'Singapore',        dial: '+65',  flag: '🇸🇬' },
  { code: 'KR', name: 'South Korea',      dial: '+82',  flag: '🇰🇷' },
  { code: 'TW', name: 'Taiwan',           dial: '+886', flag: '🇹🇼' },
  { code: 'IN', name: 'India',            dial: '+91',  flag: '🇮🇳' },
  { code: 'AE', name: 'UAE',              dial: '+971', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia',     dial: '+966', flag: '🇸🇦' },
  { code: 'IL', name: 'Israel',           dial: '+972', flag: '🇮🇱' },
  { code: 'TH', name: 'Thailand',         dial: '+66',  flag: '🇹🇭' },
  { code: 'ID', name: 'Indonesia',        dial: '+62',  flag: '🇮🇩' },
  { code: 'PH', name: 'Philippines',      dial: '+63',  flag: '🇵🇭' },
  { code: 'MY', name: 'Malaysia',         dial: '+60',  flag: '🇲🇾' },
  { code: 'VN', name: 'Vietnam',          dial: '+84',  flag: '🇻🇳' },
  { code: 'NZ', name: 'New Zealand',      dial: '+64',  flag: '🇳🇿' },
  { code: 'ZA', name: 'South Africa',     dial: '+27',  flag: '🇿🇦' },
  { code: 'EG', name: 'Egypt',            dial: '+20',  flag: '🇪🇬' },
  { code: 'NG', name: 'Nigeria',          dial: '+234', flag: '🇳🇬' },
  { code: 'KE', name: 'Kenya',            dial: '+254', flag: '🇰🇪' },
  { code: 'MX', name: 'Mexico',           dial: '+52',  flag: '🇲🇽' },
  { code: 'BR', name: 'Brazil',           dial: '+55',  flag: '🇧🇷' },
  { code: 'AR', name: 'Argentina',        dial: '+54',  flag: '🇦🇷' },
  { code: 'CL', name: 'Chile',            dial: '+56',  flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia',         dial: '+57',  flag: '🇨🇴' },
  { code: 'PE', name: 'Peru',             dial: '+51',  flag: '🇵🇪' },
  { code: 'UA', name: 'Ukraine',          dial: '+380', flag: '🇺🇦' },
  { code: 'RU', name: 'Russia',           dial: '+7',   flag: '🇷🇺' },
  { code: 'TR', name: 'Turkey',           dial: '+90',  flag: '🇹🇷' },
  { code: 'PK', name: 'Pakistan',         dial: '+92',  flag: '🇵🇰' },
  { code: 'BD', name: 'Bangladesh',       dial: '+880', flag: '🇧🇩' },
]

// ── Timezone → country detection ────────────────────────────────────────
const TZ_MAP: Record<string, string> = {
  'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US',
  'America/Los_Angeles': 'US', 'America/Phoenix': 'US', 'America/Anchorage': 'US',
  'Pacific/Honolulu': 'US', 'America/Toronto': 'CA', 'America/Vancouver': 'CA',
  'Europe/London': 'GB', 'Europe/Paris': 'FR', 'Europe/Berlin': 'DE',
  'Europe/Rome': 'IT', 'Europe/Madrid': 'ES', 'Europe/Amsterdam': 'NL',
  'Europe/Brussels': 'BE', 'Europe/Vienna': 'AT', 'Europe/Zurich': 'CH',
  'Europe/Stockholm': 'SE', 'Europe/Copenhagen': 'DK', 'Europe/Oslo': 'NO',
  'Europe/Helsinki': 'FI', 'Europe/Warsaw': 'PL', 'Europe/Prague': 'CZ',
  'Europe/Budapest': 'HU', 'Europe/Athens': 'GR', 'Europe/Lisbon': 'PT',
  'Europe/Dublin': 'IE', 'Europe/Kiev': 'UA', 'Europe/Moscow': 'RU',
  'Asia/Tokyo': 'JP', 'Asia/Shanghai': 'CN', 'Asia/Hong_Kong': 'HK',
  'Asia/Singapore': 'SG', 'Asia/Seoul': 'KR', 'Asia/Taipei': 'TW',
  'Asia/Dubai': 'AE', 'Asia/Kolkata': 'IN', 'Asia/Bangkok': 'TH',
  'Asia/Jakarta': 'ID', 'Asia/Manila': 'PH', 'Asia/Kuala_Lumpur': 'MY',
  'Asia/Ho_Chi_Minh': 'VN', 'Asia/Riyadh': 'SA', 'Asia/Jerusalem': 'IL',
  'Asia/Karachi': 'PK', 'Asia/Dhaka': 'BD', 'Asia/Istanbul': 'TR',
  'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU', 'Australia/Brisbane': 'AU',
  'Pacific/Auckland': 'NZ', 'America/Mexico_City': 'MX', 'America/Sao_Paulo': 'BR',
  'America/Argentina/Buenos_Aires': 'AR', 'America/Santiago': 'CL',
  'America/Bogota': 'CO', 'America/Lima': 'PE',
  'Africa/Johannesburg': 'ZA', 'Africa/Cairo': 'EG', 'Africa/Lagos': 'NG', 'Africa/Nairobi': 'KE',
}

function detectCountryCode(): string {
  if (typeof window === 'undefined') return 'US'
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (TZ_MAP[tz]) return TZ_MAP[tz]
    const locale = navigator.language ?? 'en-US'
    const code = locale.split('-')[1]
    if (code?.length === 2) return code.toUpperCase()
  } catch {}
  return 'US'
}

function findCountry(code: string): Country {
  return COUNTRIES.find((c) => c.code === code) ?? COUNTRIES[0]
}

// ── Props / emits ───────────────────────────────────────────────────────
const props = withDefaults(defineProps<{
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  defaultCountry?: string
  class?: string
}>(), {
  modelValue: '',
  placeholder: '+1 (555) 000-0000',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// ── State ───────────────────────────────────────────────────────────────
const defaultCode = props.defaultCountry ?? detectCountryCode()
const selected = ref<Country>(findCountry(defaultCode))
const localNumber = ref(props.modelValue ?? '')
const open = ref(false)
const search = ref('')

const filtered = computed(() =>
  search.value
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.value.toLowerCase()) ||
          c.dial.includes(search.value) ||
          c.code.toLowerCase().includes(search.value.toLowerCase()),
      )
    : COUNTRIES,
)

function selectCountry(country: Country) {
  selected.value = country
  open.value = false
  search.value = ''
  emitValue()
}

function onNumberInput(e: Event) {
  localNumber.value = (e.target as HTMLInputElement).value
  emitValue()
}

function emitValue() {
  const raw = localNumber.value.replace(/\s/g, '')
  if (!raw) {
    emit('update:modelValue', '')
    return
  }
  const e164 = raw.startsWith('+') ? raw : `${selected.value.dial}${raw}`
  emit('update:modelValue', e164)
}
</script>

<template>
  <div :class="cn('flex', props.class)">
    <!-- Country selector -->
    <Popover v-model:open="open">
      <PopoverTrigger as-child>
        <button
          type="button"
          role="combobox"
          :aria-expanded="open"
          :disabled="disabled"
          class="flex items-center gap-1.5 px-3 h-11 rounded-l-2xl rounded-r-none border border-r-0 border-input bg-card text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
        >
          <span class="text-base leading-none">{{ selected.flag }}</span>
          <span class="text-muted-foreground">{{ selected.dial }}</span>
          <ChevronsUpDown class="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent class="w-72 p-0" align="start">
        <Command>
          <CommandInput v-model="search" placeholder="Search country…" />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              <ScrollArea class="h-64">
                <CommandItem
                  v-for="country in filtered"
                  :key="country.code"
                  :value="country.code"
                  class="flex items-center gap-2 cursor-pointer"
                  @select="selectCountry(country)"
                >
                  <span class="text-base">{{ country.flag }}</span>
                  <span class="flex-1 text-sm">{{ country.name }}</span>
                  <span class="text-xs text-muted-foreground">{{ country.dial }}</span>
                  <Check
                    v-if="selected.code === country.code"
                    class="h-3.5 w-3.5 text-primary"
                  />
                </CommandItem>
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>

    <!-- Number input -->
    <input
      type="tel"
      inputmode="tel"
      :value="localNumber"
      :placeholder="placeholder"
      :disabled="disabled"
      class="flex-1 h-11 px-3 rounded-r-2xl rounded-l-none border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      @input="onNumberInput"
    />
  </div>
</template>
