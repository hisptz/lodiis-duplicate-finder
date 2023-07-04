# KB DUPLICATE FINDER

## Contents
1.  #### [About](#about)
2.  #### [Pre-requisites](#preRequisites)
3.  #### [Project setup](#setup)
4.  #### [Running the app](#run)
5.  #### [Building and Deploying app](#build)


## <a name='about'></a>1. About
This is a web application that evaluates the possible duplicates for different KB interventions. Based on the selected program and organization unit, the app is expected to evaluate possible duplicate beneficiaries and allow the download of the beneficiaries.


## <a name='preRequisites'></a>2. Pre-requisites
The project requires the following environment prerequisites to get started:

```
node 16.13.2
npm 8.3.2
react 17.0.2
```


## <a name='setup'></a>3. Project setup
To get started with this project, follow the following procedure.

<ol>
<li>Package installations</li>
<li>Proxy configuration</li>
</ol>


### Package installations

With the use of <b>yarn</b>, these app  packages are maintained with only one _***package.json***_. <br>
 To get started with package installations, Use the command: 
```
yarn 
```
or 
```
yarn add
```

### Proxy configuration

In order to start the development server for the KB duplicate finder, there has to be a set proxy to the server hosting the DHIS2 instance. 

<ul>
  <li>
    The proxy is configured by adding the DHIS2 instance server URL in the app start script as shown below:

```
  {
    "start": "d2-app-scripts start --proxy <url_to_dhis_instance>"
  }
```
  </li>

  <li>
    Additionally, on the root folder a <code>.env</code> file should be crated with the content as <code>.env.example</code> for creating base url:

```
  REACT_APP_DHIS2_BASE_URL=http://localhost:8080
```
  </li>
  </li>
</ul>


## <a name='run'></a>4. Running the app

The apps are run differently using the script commands that are specified on the root _***package.json***_.

<ul>
<li>Use the following command to run the project<br>

```
yarn start
```
 </li>

</ul>



## <a name='build'></a>5. Building and Deploying an app


On a similar note, the apps are also built separately as specified in the root _package.json_.

<ul>
<li>Build the app<br>

```
yarn build
```
This will create a zip folder in the build file, use it to deploy into instances or use the bellow command to deploy automatically.
  </li>
  
<li>
Deploy the app<br>

```
yarn deploy
```
This command will prompt for respective credentials as the result of the above command effectively.
</li>
</ul>
