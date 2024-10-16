// // src/userAuth/pages/ManagerSignUpPage.tsx

// //MUI IMPORT HERE---------------
// import * as React from 'react';
// import { Box } from '@mui/material';
// import { styled } from '@mui/material/styles';
// //-----------------------------------------

// import ManagerSignUpForm from '../../userAuth/ManagerSignUp/ManagerSignUpForm';
// import Content from '../../userAuth/ManagerSignUp/Content';

// const PageContainer = styled(Box)(({ theme }) => ({
//   minHeight: '100vh',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   padding: theme.spacing(4),
//   backgroundColor: theme.palette.background.default,
//   flexDirection: 'column',
// }));

// const SectionContainer = styled(Box)(({ theme }) => ({
//   display: 'flex',
//   flexDirection: 'row',
//   justifyContent: 'space-around',
//   alignItems: 'center',
//   width: '100%',
//   [theme.breakpoints.down('md')]: {
//     flexDirection: 'column',
//   },
// }));

// //Manager Sign Up Page Starts Here 
// const ManagerSignUpPage: React.FC = () => {
//   return (
//     <PageContainer>
//       <SectionContainer>
//         {/* Import Sign-Up Form Component Here  */}
//         <Box sx={{ width: '100%', maxWidth: 600, padding: 2 }}>
//           <ManagerSignUpForm /> 
//         </Box>
        
//         {/* Import Content Section Here */}
//         <Box sx={{ width: '100%', maxWidth: 600, padding: 2 }}>
//           <Content />
//         </Box>
//       </SectionContainer>
//     </PageContainer>
//   );
// }

// export default ManagerSignUpPage;
import React from 'react';
import Box from '@mui/material/Box';
import ManagerSignUpForm from '../../userAuth/ManagerSignUp/ManagerSignUpForm';
import Content from '../../userAuth/ManagerSignUp/Content';

const ManagerSignUpPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
      }}
    >
      {/* Sign-Up Form */}
      <Box sx={{ mb: 4 }}>
        <ManagerSignUpForm />
      </Box>

      {/* Content Section */}
      <Content />
    </Box>
  );
}

export default ManagerSignUpPage;
