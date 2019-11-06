import React from 'react';

import { Accordion, AccordionItem } from '../elements/accordion';

import SpectrumListPanel from './SpectrumListPanel';
import IntegralTablePanel from './IntegralTablePanel';
import MoleculePanel from './MoleculePanel';
import FilterPanel from './FilterPanel';
import InformationPanel from './InformationPanel';

const Panels = () => {
  return (
    <Accordion>
      <AccordionItem title="Spectra">
        <SpectrumListPanel />
      </AccordionItem>
      <AccordionItem title="Information">
        <InformationPanel />
      </AccordionItem>
      <AccordionItem title="Peaks">
        <p>peaks</p>
      </AccordionItem>
      <AccordionItem title="Filters">
        <FilterPanel />
      </AccordionItem>
      <AccordionItem title="Integrals">
        <IntegralTablePanel />
      </AccordionItem>
      <AccordionItem title="Structures">
        <MoleculePanel />
      </AccordionItem>
    </Accordion>
  );
};

export default Panels;
