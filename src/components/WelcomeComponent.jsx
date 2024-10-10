// import React from 'react';
// import { Link } from 'react-router-dom';

// const WelcomeComponent = () => {
//   // const handleCreateProject = () => {
//   //   console.log('Create a new project');
//   // };

//   // const handleConnectProject = () => {
//   //   console.log('Connect to an existing project');
//   // };

//   return (
//     <div style={styles.container}>
//       <div style={styles.content}>
//         <h2 style={styles.header}>Welcome</h2>
//         <p style={styles.paragraph}>Please choose an option below:</p>
//         {/* <div style={styles.buttonContainer}>
//           <Link to="/projects/create">
//             <button style={styles.button} onClick={handleCreateProject}>
//               Create a New Project
//             </button>
//           </Link>
//           <Link to="/projects/connect">
//             <button style={styles.button} onClick={handleConnectProject}>
//               Connect to an Existing Project
//             </button>
//           </Link>
//         </div> */}
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     display: 'flex',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '100vh',
//     backgroundImage: 'url(/images/Welcome.png)',
//     backgroundSize: 'cover',
//     backgroundPosition: 'center',
//     backgroundRepeat: 'no-repeat',
//   },
//   content: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: '20px',
//     backgroundColor: 'rgba(255, 255, 255, 0.9)',
//     borderRadius: '10px',
//     textAlign: 'center',
//   },
//   header: {
//     fontSize: '2.5em',
//     marginBottom: '10px',
//   },
//   paragraph: {
//     fontSize: '1.2em',
//     marginBottom: '20px',
//   },
//   buttonContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '10px',
//     width: '100%',
//   },
//   button: {
//     padding: '10px 20px',
//     fontSize: '1.2em',
//     cursor: 'pointer',
//     backgroundColor: '#007BFF',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '5px',
//     transition: 'background-color 0.3s ease',
//   },
// };

// export default WelcomeComponent;


import React from 'react';
import { Link } from 'react-router-dom';

const WelcomeComponent = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.header}>Dashboard</h1>
        <p style={styles.paragraph}>
        L'énergie solaire est une source d'énergie renouvelable qui utilise la lumière et la chaleur du soleil pour produire de l'électricité ou de la chaleur. Contrairement aux énergies fossiles, elle ne génère pas de pollution directe ni d'émissions de gaz à effet de serre, ce qui contribue à la lutte contre le réchauffement climatique et à la protection de l'environnement. En captant l'énergie solaire via des panneaux photovoltaïques ou thermiques, on réduit notre dépendance aux combustibles fossiles tout en préservant les ressources naturelles et en minimisant l'empreinte carbone.
        </p>
        <div style={styles.buttonContainer}>
          <Link to="/projects">
            <button style={styles.primaryButton}>Projects</button>
          </Link>
          <button style={styles.secondaryButton}>Learn more</button>
        </div>
      </div>
      <div style={styles.imageContainer}>
        <img src="/images/Welcome.png" alt="video-thumbnail" style={styles.image} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row', // Changed to row to position content and image side by side
    height: '100vh',
    padding: '20px',
    backgroundColor: '#0A192F',
  },
  content: {
    flex: 1,
    textAlign: 'left',
    color: '#FFFFFF',
    maxWidth: '600px',
    marginRight: '20px', // Added margin to create space between content and image
  },
  header: {
    fontSize: '3em',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  paragraph: {
    fontSize: '1.2em',
    lineHeight: '1.6',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '15px',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    color: '#FFFFFF',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  secondaryButton: {
    backgroundColor: '#6B7280',
    color: '#FFFFFF',
    padding: '15px 30px',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  imageContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%', // Adjusted width to take up more space on the right side
    borderRadius: '10px',
  },
};

export default WelcomeComponent;
