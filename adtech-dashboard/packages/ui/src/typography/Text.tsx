import { Typography, type TypographyProps } from "@mui/material";

// Page title — h4 bold
export function PageTitle({ children, ...props }: TypographyProps) {
  return (
    <Typography variant="h4" fontWeight={600} {...props}>
      {children}
    </Typography>
  );
}

// Section title — h6
export function SectionTitle({ children, ...props }: TypographyProps) {
  return (
    <Typography variant="h6" fontWeight={600} {...props}>
      {children}
    </Typography>
  );
}

// Subtle/secondary text
export function TextMuted({ children, ...props }: TypographyProps) {
  return (
    <Typography variant="body2" color="text.secondary" {...props}>
      {children}
    </Typography>
  );
}

// Label text — small, uppercase
export function Label({ children, ...props }: TypographyProps) {
  return (
    <Typography
      variant="caption"
      fontWeight={500}
      color="text.secondary"
      textTransform="uppercase"
      letterSpacing={0.5}
      {...props}
    >
      {children}
    </Typography>
  );
}

// Large number/stat display
export function StatValue({ children, ...props }: TypographyProps) {
  return (
    <Typography variant="h4" fontWeight={700} {...props}>
      {children}
    </Typography>
  );
}
