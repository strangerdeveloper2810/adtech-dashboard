import { Stepper as MuiStepper, Step, StepLabel } from '@mui/material';
import type { StepperProps } from '@adtech/types';

export function Stepper({ activeStep, steps, alternativeLabel = false }: StepperProps) {
  return (
    <MuiStepper activeStep={activeStep} alternativeLabel={alternativeLabel}>
      {steps.map((label) => (
        <Step key={label}>
          <StepLabel>{label}</StepLabel>
        </Step>
      ))}
    </MuiStepper>
  );
}
