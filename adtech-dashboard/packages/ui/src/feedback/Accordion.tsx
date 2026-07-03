import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { AccordionProps } from '@adtech/types';

export function Accordion({ items, defaultExpanded }: AccordionProps) {
  return (
    <>
      {items.map((item, i) => (
        <MuiAccordion key={i} defaultExpanded={i === defaultExpanded}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>{item.title}</AccordionSummary>
          <AccordionDetails>{item.content}</AccordionDetails>
        </MuiAccordion>
      ))}
    </>
  );
}
