import React from 'react'
import {FormControl, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";

const FormField = () => (
    <FormField
        name="username"
        control={form.control}
        render={({ field }) => (
            <FormItem>
                <FormLabel className="">Username</FormLabel>
                <FormControl>
                    <Input
                        {...field}
                        placeholder="Enter your username"
                        className=""
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        )}
    />
)
export default FormField
