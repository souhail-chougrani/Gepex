// Compare two objects with there values.
export function compare(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}


export const DATE_FR = {
  firstDayOfWeek: 0,
  dayNames: [
    'Dimanche',
    'Lundi ',
    'Mardi ',
    'Mercredi ',
    'Jeudi ',
    'Vendredi ',
    'Samedi '
  ],
  dayNamesShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
  dayNamesMin: ['Di', 'Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa'],
  monthNames: [
    'Janvier ',
    'Février ',
    'Mars ',
    'Avril ',
    'Mai ',
    'Juin ',
    'Juillet ',
    'Août ',
    'Septembre ',
    'Octobre ',
    'Novembre ',
    'Décembre'
  ],
  monthNamesShort: [
    'Jan',
    'Fev',
    'Mar',
    'Avr',
    'Mai',
    'Jui',
    'Juil',
    'Ao',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  today: 'Aujourd hui',
  clear: 'Clear'
};
