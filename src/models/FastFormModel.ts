import * as Yup from "yup";

export type FastFormModel = Yup.InferType<typeof FastFormModelSchema>;
export const getDefaultFastFormModel = (): FastFormModel => FastFormModelSchema.cast({});
export const FastFormModelSchema = Yup.object().shape({
  email: Yup.string()
    .required("Required")
    .min(2, "Must be more than 2 characters")
    .max(20, "Must be less than 20 characters")
    .email("Must be a valid email")
    .test("expensive-validation", "Email already registered", async (value) => {
      const isValid = await mockExpensiveEmailValidationCheck(value);
      return isValid;
    })
    .default("Subcribe or else 🔫"),
});

const mockExpensiveEmailValidationCheck = (email: string): boolean => {
  const start = Date.now();
  while (Date.now() - start < 200) {
    // Simulate blocking task
  }
  const isAvailable = email.includes("beanz");
  return isAvailable;
};
