import React from 'react';

import InformationPanel from './PanelsWrapper';
import SpectrumListPanel from './SpectrumListPanel';
import IntegralTablePanel from './IntegralTablePanel';
import MoleculePanel from './MoleculePanel';

const Panels = () => {
  const infoList = [
    {
      id: 'spectraPanel',
      title: 'Spectra',
      component: <SpectrumListPanel />,
    },
    {
      id: 'informationPanel',
      title: 'Information',
      component: <p>information</p>,
    },
    {
      id: 'integralsPanel',
      title: 'Integrals',
      component: <IntegralTablePanel />,
    },
    {
      id: 'peaksPanel',
      title: 'Peaks',
      component: <p>Peaks</p>,
    },
    {
      id: 'structuresPanel',
      title: 'Structures',
      component: <MoleculePanel />,
    },
  ];

  return (
    <div>
      <InformationPanel activeItem="spectraPanel" listItem={infoList} />
    </div>
  );
};

export default Panels;