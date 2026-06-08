<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "lucide-vue-next"
import {
  CalendarRoot,
  CalendarHeader,
  CalendarHeading,
  CalendarGrid,
  CalendarGridHead,
  CalendarGridRow,
  CalendarGridBody,
  CalendarHeadCell,
  CalendarCell,
  CalendarCellTrigger,
  CalendarPrev,
  CalendarNext,
} from "reka-ui"
import { cn } from "../lib/utils"
import { buttonVariants } from "./button"

interface Props {
  class?: string
}
const props = defineProps<Props>()
</script>
<template>
  <CalendarRoot v-slot="{ grid, weekDays }" :class="cn('p-3', props.class)">
    <CalendarHeader class="flex justify-center pt-1 relative items-center w-full">
      <CalendarPrev :class="cn(buttonVariants({ variant: 'outline' }), 'size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1')">
        <ChevronLeft class="size-4" />
      </CalendarPrev>
      <CalendarHeading class="text-sm font-medium" />
      <CalendarNext :class="cn(buttonVariants({ variant: 'outline' }), 'size-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1')">
        <ChevronRight class="size-4" />
      </CalendarNext>
    </CalendarHeader>
    <div class="flex flex-col sm:flex-row gap-2 mt-4">
      <CalendarGrid v-for="month in grid" :key="month.value.toString()" class="w-full border-collapse space-x-1">
        <CalendarGridHead>
          <CalendarGridRow class="flex">
            <CalendarHeadCell v-for="day in weekDays" :key="day" class="text-muted-foreground rounded-md w-8 font-normal text-xs">
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow v-for="(weekDates, index) in month.rows" :key="`weekDate-${index}`" class="flex w-full mt-2">
            <CalendarCell v-for="weekDate in weekDates" :key="weekDate.toString()" :date="weekDate" class="relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([data-selected])]:bg-accent [&:has([data-selected])]:rounded-md">
              <CalendarCellTrigger
                :day="weekDate"
                :month="month.value"
                :class="cn(
                  buttonVariants({ variant: 'ghost' }),
                  'size-8 p-0 font-normal',
                  'data-[selected]:opacity-100 data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:hover:bg-primary data-[selected]:hover:text-primary-foreground data-[selected]:focus:bg-primary data-[selected]:focus:text-primary-foreground',
                  'data-[today]:bg-accent data-[today]:text-accent-foreground',
                  'data-[outside-view]:text-muted-foreground data-[outside-view]:opacity-50',
                  'data-[disabled]:text-muted-foreground data-[disabled]:opacity-50',
                  'data-[unavailable]:text-muted-foreground data-[unavailable]:line-through'
                )"
              />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </div>
  </CalendarRoot>
</template>
