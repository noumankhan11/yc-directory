"use client";

import { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";

export default function StartupForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pitch, setPitch] = useState("");

  const handleFormSubmit = async (
    prevState: any,
    formData: FormData
  ) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        pitch,
      };
      await formSchema.parseAsync(formValues);
      console.log(formValues);
      // const result = await createIdea(formValues);
      // console.log(result)
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErros = error.flatten().fieldErrors;
        setErrors(fieldErros as unknown as Record<string, string>);
        return {
          ...prevState,
          error: "Validation failed ",
          status: "ERROR",
        };
      }
      return {
        ...prevState,
        error: "An unexpected error accurred",
        status: "ERROR",
      };
    }
  };

  const [state, formAction, isPending] = useActionState(
    handleFormSubmit,
    { error: "", status: "Initial" }
  );

  return (
    <form action={formAction}>
      <div className="title">
        <label htmlFor="title" className="startup-form">
          Title
        </label>
        <Input
          id="title"
          name="title"
          className="startup-from_input"
          required
          placeholder="Startup Title"
        />
        {errors.title && (
          <p className="strtup-form_error">{errors.title}</p>
        )}
      </div>
      <div className="description">
        <label htmlFor="description" className="startup-form">
          Description
        </label>
        <Textarea
          id="description"
          name="description"
          className="startup-form_textarea"
          required
          placeholder="Startup Description"
        />
        {errors.description && (
          <p className="strtup-form_error">{errors.description}</p>
        )}
      </div>
      <div>
        <label htmlFor="category" className="startup-form">
          Category
        </label>
        <Input
          id="category"
          name="category"
          className="startup-from_input"
          required
          placeholder="Startup Category (Tech, Health, Education..."
        />
        {errors.category && (
          <p className="strtup-form_error">{errors.category}</p>
        )}
      </div>
      <div>
        <label htmlFor="link" className="startup-form">
          Image URL
        </label>
        <Input
          id="link"
          name="link"
          className="startup-from_input"
          required
          placeholder="Startup Image URL"
        />
        {errors.link && (
          <p className="strtup-form_error">{errors.link}</p>
        )}
      </div>
      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && (
          <p className="strtup-form_error">{errors.pitch}</p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="startup-form_btn text-white">
        {isPending ? "Submiting..." : "Submit"}
        <Send className="size-6 ml-2" />
      </Button>
    </form>
  );
}
