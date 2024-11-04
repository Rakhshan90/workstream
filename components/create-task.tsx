"use client"

import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { taskSchema, taskSchemaType } from "@/actions/task/schema"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { getProjectEmployees } from "@/actions/user/index"
import { createTask } from "@/actions/task/index"
import {Role} from '@/db/index'
import { useRouter } from "next/navigation"

const CreateTask = ({ id, role }: { id: number, role: Role | null }) => {


    const router = useRouter();
    if(role !== 'MANAGER'){
        router.push(`/board/${id}`)
    }

    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false)
    const [employees, setEmployees] = useState<{ id: number, name: string, email: string }[]>([]);

    const getProjectSpecificEmployees = async () => {
        const res = await getProjectEmployees(id);
        setEmployees(res.employees);
    }

    useEffect(() => {
        getProjectSpecificEmployees();
    }, []);

    const form = useForm<taskSchemaType>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            projectId: id,
            employeeId: undefined,
            title: "",
            description: "",
            status: undefined,
            startDate: undefined,
            endDate: undefined,
            priority: undefined,
        },
    })

    async function onSubmit(values: z.infer<typeof taskSchema>) {
        setIsLoading(true)

        try {
            const res = await createTask(values?.projectId, values?.employeeId, values?.title, values?.description, values?.startDate, values?.endDate, values?.status, values?.priority);

            setIsLoading(false);
            toast({
                title: "Response message",
                description: res.message,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create task, try again",
            })
        }
    }   

    return (
        <Card className="w-full max-w-md bg-slate-900 border-none text-white">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-center text-blue-600">
                    Create task
                </CardTitle>
                <CardDescription className="text-center text-slate-200">
                    Create a task for your project board and assign it to your team member
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem >
                                    {/* <FormLabel>Name</FormLabel> */}
                                    <FormControl>
                                        <Input className="bg-slate-800 border-none placeholder:text-slate-200" placeholder="Title" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Description</FormLabel> */}
                                    <FormControl>
                                        <Input className="bg-slate-800 border-none placeholder:text-slate-200"
                                            placeholder="Description of the task" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Add combobox component to get the value of employeeId */}
                        <FormField
                            control={form.control}
                            name="employeeId"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Employee</FormLabel> */}
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className={`w-full justify-between bg-slate-800 hover:bg-slate-800 hover:text-slate-300 border-none text-slate-200 ${!field.value && "text-muted-foreground"}`}
                                                >
                                                    {field.value
                                                        ? employees.find((employee) => employee.id === field.value)?.name
                                                        : "Assign to..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[200px] p-0 bg-slate-800 border-none">
                                                <Command className="bg-slate-800 text-slate-300">
                                                    <CommandInput placeholder="Search employee..." className="bg-slate-800 text-slate-200" />
                                                    <CommandList>
                                                        <CommandEmpty>No employee found.</CommandEmpty>
                                                        <CommandGroup>
                                                            {employees.map((employee) => (
                                                                <CommandItem
                                                                    itemType='integer'
                                                                    key={employee.id}
                                                                    // value={employee.id}
                                                                    onSelect={() => {
                                                                        form.setValue('employeeId', employee.id);
                                                                    }}
                                                                    className="text-slate-300 focus:bg-slate-800 focus:text-slate-300"
                                                                >
                                                                    <Check
                                                                        className={cn(
                                                                            "mr-2 h-4 w-4",
                                                                            field.value === employee.id ? "opacity-100" : "opacity-0"
                                                                        )}
                                                                    />
                                                                    {employee.name}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Status</FormLabel> */}
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl className="bg-slate-800 border-none placeholder:text-slate-200">
                                            <SelectTrigger className="bg-slate-800 border-none text-slate-200 placeholder:text-slate-200">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-slate-800 text-white border-none">
                                            <SelectItem
                                                className="focus:bg-slate-900 focus:text-white"
                                                value="PENDING">
                                                Pending
                                            </SelectItem>
                                            <SelectItem
                                                className="focus:bg-slate-900 focus:text-white"
                                                value="ONGOING">
                                                In progress
                                            </SelectItem>
                                            <SelectItem
                                                className="focus:bg-slate-900 focus:text-white"
                                                value="COMPLETED">
                                                Completed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="priority"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel>Status</FormLabel> */}
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl className="bg-slate-800 border-none placeholder:text-slate-200">
                                            <SelectTrigger className="bg-slate-800 border-none text-slate-200 placeholder:text-slate-200">
                                                <SelectValue placeholder="Select priority" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-slate-800 text-white border-none">
                                            <SelectItem
                                                className="focus:bg-slate-900 focus:text-white"
                                                value="LOW">
                                                Low
                                            </SelectItem>
                                            <SelectItem
                                                className="focus:bg-slate-900 focus:text-white"
                                                value="MEDIUM">
                                                Medium
                                            </SelectItem>
                                            <SelectItem
                                                className="focus:bg-slate-900 focus:text-white"
                                                value="HIGH">
                                                High
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    {/* <FormLabel>Start Date</FormLabel> */}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={`w-full pl-3 text-left font-normal bg-slate-800 border-none text-slate-200 ${!field.value && "text-muted-foreground"}`}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Start time</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 relative left-14" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    {/* <FormLabel>End Date</FormLabel> */}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={`w-full pl-3 text-left font-normal bg-slate-800 border-none text-slate-200 ${!field.value && "text-muted-foreground"}`}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>End time</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 relative left-14" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                    date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-slate-800" disabled={isLoading}>
                            {isLoading ? "Creating..." : "Create"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default CreateTask