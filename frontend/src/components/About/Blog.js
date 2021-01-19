import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import GitHubIcon from '@material-ui/icons/GitHub';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';
import MainFeaturedPost from './MainFeaturedPost';
import FeaturedPost from './FeaturedPost';
import Main from './Main';
import Sidebar from './Sidebar';
import Footer from './Footer';


const useStyles = makeStyles((theme) => ({
  mainGrid: {
    marginTop: theme.spacing(3),
  },
}));

const sections = [
  { title: 'Technology', url: '#' },
  { title: 'Design', url: '#' },
  { title: 'Culture', url: '#' },
  { title: 'Business', url: '#' },
  { title: 'Politics', url: '#' },
  { title: 'Opinion', url: '#' },
  { title: 'Science', url: '#' },
  { title: 'Health', url: '#' },
  { title: 'Style', url: '#' },
  { title: 'Travel', url: '#' },
];

const mainFeaturedPost = {
  title: 'Aplikacja dla rodziców',
  description:
    "Pragniemy umożliwić Państwu zgłoszenie niepożądanych odczynów poszczepiennych bez wychodznia z domu.",
  image: 'https://cdn.medme.pl/zdjecie/12829,840,560,1/kalendarz-szczepien.jpg',
  imgText: 'main image description',
  linkText: 'Ostatnio zaktualizoawliśmy naszą bazę szczepionek o ',
};

const featuredPosts = [
  {
    title: 'Menveo',
    date: 'Grudzień 12',
    description:
      'Szczepionka przeciwtężcowa',
    image: 'https://www.mistrymedical.com/graphics/products/large/7d6zw0.jpg',
    imageText: 'Image Text',
  },
  {
    title: 'Adacel',
    date: 'Grudzień 11',
    description:
      'Szczepionka przeciw błonicy',
    image: 'https://mimsshst.blob.core.windows.net/drug-resources/TH/packshot/Adacel6001PPS0.JPG',
    imageText: 'Image Text',
  },
];


const sidebar = {
  title: 'Uwaga !!!',
  description:
    'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
  archives: [
    { title: 'Styczeń 2020', url: '#' },
    { title: 'Luty 2020', url: '#' },
    { title: 'Marzec 2020', url: '#' },
    { title: 'Kwiecień 2020', url: '#' },
    { title: 'Maj 2020', url: '#' },
    { title: 'Czerwiec 20209', url: '#' },
    { title: 'Lipiec 2020', url: '#' },
    { title: 'Sierpień 2020', url: '#' },
    { title: 'Wrzesień 2020', url: '#' },
    { title: 'Październik 2020', url: '#' },
    { title: 'Listopad 2020', url: '#' },
  ],
  social: [
    { name: 'GitHub', icon: GitHubIcon },
    { name: 'Twitter', icon: TwitterIcon },
    { name: 'Facebook', icon: FacebookIcon },
  ],
};

export default function Blog() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="lg">
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          <Grid container spacing={4}>
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.title} post={post} />
            ))}
          </Grid>
          <Grid container spacing={5} className={classes.mainGrid}>
            <Main title="Opis aplikacji"/>
            <Sidebar
              title={sidebar.title}
              description={sidebar.description}
              archives={sidebar.archives}
              social={sidebar.social}
            />
          </Grid>
        </main>
      </Container>
      <Footer title="Dziękujemy" description="Projekt pracy inżynierskiej" />
    </React.Fragment>
  );
}
