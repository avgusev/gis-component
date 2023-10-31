export const HwdEveness = {
  keys: {
    eveness_bkwd_lane_1: 'ровность, обратное направление, полоса 1',
    eveness_bkwd_lane_2: 'ровность, обратное направление, полоса 2',
    eveness_bkwd_lane_3: 'ровность, обратное направление, полоса 3',
    eveness_bkwd_lane_4: 'ровность, обратное направление, полоса 4',
    eveness_bkwd_lane_5: 'ровность, обратное направление, полоса 5',
    eveness_bkwd_lane_6: 'ровность, обратное направление, полоса 6',
    eveness_bkwd_lane_7: 'ровность, обратное направление, полоса 7',
    eveness_bkwd_lane_8: 'ровность, обратное направление, полоса 8',
    eveness_bkwd_max: 'ровность, обратное направление макс. значение',
    eveness_fwd_lane_1: 'ровность, прямое направление, полоса 1',
    eveness_fwd_lane_2: 'ровность, прямое направление, полоса 2',
    eveness_fwd_lane_3: 'ровность, прямое направление, полоса 3',
    eveness_fwd_lane_4: 'ровность, прямое направление, полоса 4',
    eveness_fwd_lane_5: 'ровность, прямое направление, полоса 5',
    eveness_fwd_lane_6: 'ровность, прямое направление, полоса 6',
    eveness_fwd_lane_7: 'ровность, прямое направление, полоса 7',
    eveness_fwd_lane_8: 'ровность, прямое направление, полоса 8',
    eveness_fwd_max: 'ровность, прямое направление макс. значение',
    start: 'начало участка',
    finish: 'конецначало участка',
    is_normative: 'cоответствие нормативному_состоянию',
    norma: 'нормативное значение показателя, промилле',
    segment_length: 'протяженность, км',
    source_system_gid: 'cистема-источник',
  },
  columnAlign: ['center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center', 'center'],
  columnFocus: [
    'table-focus',
    '',
    'table-focus',
    '',
    'table-focus',
    '',
    'table-focus',
    '',
    'table-focus',
    '',
    'table-focus',
    '',
    'table-focus',
    '',
    'table-focus',
    '',
    'table-focus',
    '',
    'table-focus',
    '',
    'table-focus',
    '',
    'table-focus',
    '',
  ],
  columnWidth: [],
};

export const HwdPavementStrength = {
  keys: {
    source_system_gid: 'cистема-источник',
    start: 'начало участка',
    finish: 'конец участка',
    segment_length: 'протяженность, км',
    fact_elasticity: 'фактический модуль упругости',
    plan_elasticity: 'требуемый модуль упругости',
    strength_coefficient: 'коэффициент прочности',
    is_normative: 'соответствие нормативному состоянию',
  },
  columnAlign: [],
  columnFocus: ['table-focus', '', 'table-focus', '', 'table-focus', '', 'table-focus', ''],
  columnWidth: [],
};

export const HwdClutch = {
  keys: {
    km_start: 'Начало участка, км',
    km_finish: 'Конец участка, км',
    clutch_fwd_lane_1: 'сцепление, прямое направление, полоса 1',
    clutch_fwd_lane_2: 'сцепление, прямое направление, полоса 2', 
    clutch_fwd_lane_3: 'сцепление, прямое направление, полоса 3',
    clutch_fwd_lane_4: 'сцепление, прямое направление, полоса 4',
    clutch_fwd_lane_5: 'сцепление, прямое направление, полоса 5',
    clutch_fwd_lane_6: 'сцепление, прямое направление, полоса 6',
    clutch_fwd_lane_7: 'сцепление, прямое направление, полоса 7',
    clutch_fwd_lane_8: 'сцепление, прямое направление, полоса 8',
    clutch_bkwd_lane_1: 'сцепление, обратное направление, полоса 1',
    clutch_bkwd_lane_2: 'сцепление, обратное направление, полоса 2',
    clutch_bkwd_lane_3: 'сцепление, обратное направление, полоса 3',
    clutch_bkwd_lane_4: 'сцепление, обратное направление, полоса 4',
    clutch_bkwd_lane_5: 'сцепление, обратное направление, полоса 5',
    clutch_bkwd_lane_6: 'сцепление, обратное направление, полоса 6',
    clutch_bkwd_lane_7: 'сцепление, обратное направление, полоса 7',
    clutch_bkwd_lane_8: 'сцепление, обратное направление, полоса 8',    
    start: 'Начало участка',
    finish: 'Конец участка',
    segment_length: 'Протяженность участка, км',
    norma: 'Нормативное значение',
    is_normative: 'Соответствие нормативному состоянию'
  },
  columnAlign: [],
  columnFocus: [],
  columnWidth: [],
};
