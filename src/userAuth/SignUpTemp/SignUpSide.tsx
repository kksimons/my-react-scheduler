// import * as React from 'react';

// import Stack from '@mui/material/Stack';
// import Grid from '@mui/material/Grid';
// import SignInCard from './SignInCard';
// import Content from './Content';

// export default function SignInSide() {


//   return (
//     <Stack
//       direction="column"
//       component="main"
//       sx={[
//         {
//           justifyContent: 'space-between',
//           // height: { xs: 'auto', md: '100%' },
//         },
//       ]}
//     >
//       <Stack
//         direction={{ xs: 'column-reverse', md: 'row' }}
//         sx={{
//           // justifyContent: 'center',
//           // gap: { xs: 6, sm: 12 },
//           // p: { xs: 2, sm: 4 },
//           // m: 'auto',
//         }}
//       >
//         <Content />
//         <SignInCard />
//       </Stack>
//     </Stack>
//   );
// }
import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Content from './Content'; 
import SignUpCard from './SignUpCard';

export default function MainLayout() {
  return (
    <Box component="main" sx={{ padding: { xs: 2, sm: 4 }, height: '100%' }}>
      <Grid
        container
        spacing={{ xs: 6, sm: 12 }}  // Adds spacing between grid items
        justifyContent="center"      // Centers the grid items horizontally
        alignItems="center"          // Aligns the items vertically
        direction={{ xs: 'column', md: 'row' }}       
      >
        <Grid item xs={12} md={6}>
          <Content />
        </Grid>
        <Grid item xs={12} md={6}>
          <SignUpCard />
        </Grid>
      </Grid>
    </Box>
  );
}
