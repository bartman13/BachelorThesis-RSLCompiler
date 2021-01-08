import React from 'react';
<<<<<<< HEAD
=======
import clsx from 'clsx';
>>>>>>> develop
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
<<<<<<< HEAD
import FormHelperText from '@material-ui/core/FormHelperText';
import FormLabel from '@material-ui/core/FormLabel';
import Button from '@material-ui/core/Button';
import { buttonSuccess } from "../styles/buttons";


const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(3),
  },
  button: buttonSuccess
}));

export default function ErrorRadios() {
  const classes = useStyles();
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('Choose wisely');

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setHelperText(' ');
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (value === 'best') {
      setHelperText('You got it!');
      setError(false);
    } else if (value === 'worst') {
      setHelperText('Sorry, wrong answer!');
      setError(true);
    } else {
      setHelperText('Brak zaznaczonej decyzji');
      setError(true);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl component="fieldset" error={error} className={classes.formControl}>
        <FormLabel component="legend">Decyzja Lekarska</FormLabel>
        <RadioGroup aria-label="quiz" name="quiz" value={value} onChange={handleRadioChange}>
          <FormControlLabel value="best" control={<Radio />} label="Ciężki" />
          <FormControlLabel value="worst1" control={<Radio />} label="Poważny" />
          <FormControlLabel value="worst2" control={<Radio />} label="Lekki" />
          <FormControlLabel value="worst3" control={<Radio />} label="Nie mogę podjąć decyzji" />
          <FormControlLabel value="worst4" control={<Radio />} label="Nie stwierdzam wystąpienia Nop" />
          <FormControlLabel value="worst4" control={<Radio />} label="Brak zgodności danych." />

        </RadioGroup>
        <FormHelperText>{helperText}</FormHelperText>
        <Button type="submit" variant="outlined" color="primary" className={classes.button}>
          Zatwierdź
        </Button>
      </FormControl>
    </form>
=======
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
});

// Inspired by blueprintjs
function StyledRadio(props) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="default"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}

export default function CustomizedRadios() {
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Decyzja</FormLabel>
      <RadioGroup defaultValue="group" aria-label="group" name="customized-radios">
        <FormControlLabel value="Invalid" control={<StyledRadio />} label="Nie zgodność z książeczką" />
        <FormControlLabel value="Easy" control={<StyledRadio />} label="Łagodny" />
        <FormControlLabel value="Important" control={<StyledRadio />} label="Poważny" />
        <FormControlLabel value="Hard" control={<StyledRadio />} label="Ciężki" />
        <FormControlLabel value="Kontakt" control={<StyledRadio />} label="Kontakt" />
      </RadioGroup>
    </FormControl>
>>>>>>> develop
  );
}