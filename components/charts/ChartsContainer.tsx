'use client'

import { useAppDispatch, useAppSelector } from '@/app/store'
import { getTasksAsync } from '@/app/store/asyncActions'
import { selectApparels, selectTasks } from '@/app/store/tasksSlice'
import { BarChart } from '@mantine/charts'
import { Box, ComboboxItem, Select } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

interface MonthlyTaskCount {
    month: string
    cantidad: number // Cantidad total de tareas para el mes
}

const ChartsContainer: React.FC = () => {
    const { data: session } = useSession()
    const dispatch = useAppDispatch()
    const tasks = useAppSelector(selectTasks)
    const aparells = useAppSelector(selectApparels)
    const [graphData1, setGraphData1] = useState<MonthlyTaskCount[]>([])
    const [graphData2, setGraphData2] = useState<{}[]>([])
    const [selectedYear, setSelectedYear] = useState<ComboboxItem>({
        label: new Date().getFullYear().toString(),
        value: new Date().getFullYear().toString(),
    })
    const years = Array.from({ length: 5 }, (_, i) => {
        const year = new Date().getFullYear() - i
        return {
            label: year.toString(),
            value: year.toString(),
        }
    })

    const months = [
        { abrv: 'Gen', num: '01' },
        { abrv: 'Feb', num: '02' },
        { abrv: 'Mar', num: '03' },
        { abrv: 'Abr', num: '04' },
        { abrv: 'Mai', num: '05' },
        { abrv: 'Jun', num: '06' },
        { abrv: 'Jul', num: '07' },
        { abrv: 'Ago', num: '08' },
        { abrv: 'Sep', num: '09' },
        { abrv: 'Oct', num: '10' },
        { abrv: 'Nov', num: '11' },
        { abrv: 'Dic', num: '12' },
    ]

    useEffect(() => {
        const fetchData = async () => {
            if (!session) return
            await dispatch(getTasksAsync(session?.user?.Codi_Client))
        }
        fetchData()
    }, [session, dispatch])

    useEffect(() => {
        const tasksFiltered = tasks.filter(
            (t) =>
                parseInt(t.solicited_date.slice(0, 4), 10) ===
                +(selectedYear?.value ?? new Date().getFullYear())
        )

        const monthlyTaskCounts: Record<string, number> = months.reduce(
            (acc, month) => {
                acc[month.abrv] = 0 // Inicializa la cuenta en 0 para cada mes
                return acc
            },
            {} as Record<string, number>
        )

        tasksFiltered.forEach((task) => {
            const monthNum = task.solicited_date.slice(4, 6) // Obtiene el mes (ej. '01')
            const monthObj = months.find((month) => month.num === monthNum)

            if (monthObj) {
                const monthAbrv = monthObj.abrv
                monthlyTaskCounts[monthAbrv]++ // Incrementa la cuenta para ese mes
            }
        })

        // Convertir el objeto acumulado en un array
        const result: MonthlyTaskCount[] = Object.keys(monthlyTaskCounts).map(
            (monthAbrv) => ({
                month: monthAbrv,
                cantidad: monthlyTaskCounts[monthAbrv],
            })
        )

        setGraphData1(result)

        // Lógica para calcular los costos por aparell
        const sumCosts: { [key: string]: number } = {}

        tasksFiltered.forEach((task) => {
            const apparelName = task.apparel_name
            const cost = task.total ?? 0

            if (sumCosts[apparelName]) {
                sumCosts[apparelName] += cost
            } else {
                sumCosts[apparelName] = cost
            }
        })

        const transformedArray = Object.entries(sumCosts).map(
            ([aparell, cost]) => ({
                aparell,
                cost,
            })
        )

        setGraphData2(
            transformedArray.map((t) => ({
                cost: t.cost.toFixed(2),
                aparell:
                    t.aparell === '0'
                        ? 'Fulls sense aparell'
                        : aparells.find(
                              (a) =>
                                  !isNaN(parseInt(t.aparell)) &&
                                  a.IDFAPARELLS === parseInt(t.aparell)
                          )?.MODEL ?? t.aparell,
            }))
        )
    }, [tasks, selectedYear]) // Dependencias incluyen `selectedYear`

    return (
        <>
            <div className="flex items-center justify-end">
                <h4 className="text-h4 font-bold tracking-tight text-primary mr-4">
                    Selecciona l'any:
                </h4>
                <Select
                    className="w-1/12"
                    data={years}
                    value={selectedYear ? selectedYear.value : null}
                    onChange={(_value, option) => setSelectedYear(option)}
                />
            </div>

            <div className="flex flex-col w-full">
                <h4 className="text-h4 font-bold tracking-tight text-primary mb-4">
                    Fulls de treball per mes
                </h4>
                <BarChart
                    h={300}
                    withLegend
                    data={graphData1}
                    dataKey="month"
                    type="stacked"
                    series={[{ name: 'cantidad', color: 'violet.6' }]}
                />
            </div>
            <div className="flex flex-col w-full mt-8">
                <h4 className="text-h4 font-bold tracking-tight text-primary mb-4">
                    Despeses per aparell
                </h4>
                <Box style={{ overflowX: 'auto' }}>
                    <BarChart
                        h={350}
                        data={graphData2}
                        dataKey="aparell"
                        valueFormatter={(value) =>
                            new Intl.NumberFormat('de-DE').format(value)
                        }
                        series={[{ name: 'cost', color: 'red.6' }]}
                        tickLine="y"
                        xAxisProps={{
                            angle: -30,
                            height: 100,
                            textAnchor: 'end',
                            style: { fontSize: '12px' },
                        }}
                    />
                </Box>
            </div>
        </>
    )
}

export default ChartsContainer
