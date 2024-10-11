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
import SignInCard from './SignInCard';  // Import the SignInCard component

export default function MainLayout() {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        justifyContent: 'center',  // Centers horizontally
        alignItems: 'center',      // Centers vertically
        height: '100vh',           // Full viewport height to ensure vertical centering
        padding: { xs: 2, sm: 4 }, // Add padding for smaller screens
      }}
    >
      <SignInCard />  {/* Centered SignInCard */}
    </Box>
  );
}
