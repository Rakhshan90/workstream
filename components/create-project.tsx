"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { projectSchema, ProjectSchemaType } from "@/actions/project-board/schema"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { createProject } from "@/actions/project-board/index"
import {Role} from '@/db/index'

const CreateProject = ({role}: {role: Role | null}) => {

    const router = useRouter()
    if(role !== 'MANAGER'){
        router.push('/');
    }

    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<ProjectSchemaType>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            name: "",
            description: "",
            status: undefined,
            startDate: undefined,
            endDate: undefined,
        },
    })

    async function onSubmit(values: z.infer<typeof projectSchema>) {
        setIsLoading(true)

        try {
            const res = await createProject(values?.name, values?.description, values?.startDate, values?.endDate, values?.status);
            setIsLoading(false);
            toast({
                title: "Response",
                description: res.message,
            })
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to create project, try again",
            })
        }

        setTimeout(() => {
            setIsLoading(false)
            router.push("/board-list")
        }, 2000)
    }

    return (
        <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md bg-slate-900 border-none text-white">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold text-center text-blue-600">
                        Create board
                    </CardTitle>
                    <CardDescription className="text-center text-slate-200">
                        Create your project board
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem >
                                        <FormControl>
                                            <Input className="bg-slate-800 border-none placeholder:text-slate-200" placeholder="Project name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input className="bg-slate-800 border-none placeholder:text-slate-200"
                                                placeholder="Description of the project" {...field} />
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl className="bg-slate-800 border-none placeholder:text-slate-200">
                                                <SelectTrigger className="bg-slate-800 border-none text-slate-200 placeholder:text-slate-200">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-800 text-white border-none">
                                                <SelectItem
                                                    className="focus:bg-slate-900 focus:text-white"
                                                    value="NOT_STARTED">
                                                    Not started
                                                </SelectItem>
                                                <SelectItem
                                                    className="focus:bg-slate-900 focus:text-white"
                                                    value="IN_PROGRESS">
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
                                name="startDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
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
                                                            <span>Start date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
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
                                                            <span>End date</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
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
        </div>
    )
}

export default CreateProject