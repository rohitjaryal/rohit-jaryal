# Currency converter

## Quick Start

Problem 1 :

Can be run via nodejs or npm run command in root directory
 ```sh
    npm run run_problem1
```


Problem 2  :

Can be run via nodejs or npm run command in root directory
 ```sh
    npm install
    npm start
    Open http://localhost:3000/
```

To configure prices api url, change .evn >  REACT_APP_PRICES_URL


Problem 3  :
One file contain the issues in MessyReact file and 'ImprovementReact.tsx' contain the improved version.



## Project structure
   ```
src/
  problem1/
        
   problem2/
            apis/
            assets/
            components/
            includes/
            router/
            stores/
            types/
            views/
    
   problem3/
   
```
More description about main components
1. apis- All apis call will be kept here.
2. components - This folder contains all the components that are being used on views with the intention of having a shared component library for easier extension and updates.
3. includes- This folder contains the helper libraries.
4. providers- Material UI HOC
5. types- TS interfaces/type.


## Things that can be improved
1. The converted amount can change without clicking Convert button.
2. Bit better UX on responsive designing.
3. The from and to currency can be added in URL search bar so that on searching history user can have prefilled fields.
4. Unit tests.


 

