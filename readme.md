
## The Stack

deno: felt like trying something slightly new. Functionally it's practically the same as using node. The abc library was used to write the web server, as well as a sqlite library that allows for sql queries from within deno.

sqlite3 db: since the project is intended to be run and tested locally, it's a better idea to use a database that also runs locally without the need of a running database service (like postgres or monogdb).

## Data Set Choices

The Stats Canada site has a couple of options at the top for you to customize the data they return to you.

Geography: Canada
Characteristics after graduation: Graduates reporting employment income
Status of student in Canada: Canadian and international students
Reference period: 2010 to 2016

### Thought process
For geography, since a location field was not mentioned in the specification for the frontend, I decided to stay safe and take all of Canada, which should give us more data points as well.

We also want graduates who actually report income information, otherwise we won't have any data.

For resident status, I decided to take along with international students, as that once again will give us more data points to work with.

As for reference period, I decided to grab as many points as possible. Although taking the most recent year (2016), would give us the most up to date data and current trend, taking a larger variety of points will guarantee our data to be more stable.

Now for the variables: Age group and Gender. I downloaded each combination of age group and gender from the Stats Canada website as csv, resulting in a total of four csv files to work with.

## Data transformation

### Parsing csv

To be completely honest, the csv file Stats Canada provided was very disgusting to work with. Here's what I did to clean it up a bit
- Get rid of the header and footer that came in the file for some reason
- Remove leading commas from each line, so separate rows will be newline separated - %s/^,//g
- Using vim search and replace, replaced '..' and 'x' with -1   - %s/".."/"-1"/g and %s/"x"/"-1"/g
- The commas in numbers were removed using the following regular expression - %s/\(\d\),\(\d\)/\1\2/g
- The name of the education level, with age group and gender was inserted at the beginning of each line. This way there is no need for headers, and we are confident each line is a valid data point
- Switched to using | as delimiter instead of commas

Much better now. In the future, this process can be easily automated using vim macros or a shell script, but it should do for now.

### Dealing with unknown / redacted values

The naive method would probably be to treat these values as zero. However, this will probably mess with the trend. For example, if for one job you see that the pay across the years was something like:
```
42000, 45000, x, 41000, x, x
```
is it really safe to say that those years have median wages of zero? Of course not. A better method would probably to use the average values in those spots, so it interferes with the rest of the data as little as possible. We will do this conversion whenever the user makes the request for data, in case we update our dataset gets updated in the future.

### Populating the database for the first time

Now we need to take our cleaned up csv and insert it into our sqlite3 database. In other words, we need to parse the csv, extract the data and construct a valid sql query that will insert the data. I wrote a single shellscript to accomplish the task, useage is as follows:
```
./querygen.sh [input csv] [output file]
```
then after, we can pipe the output into the sqlite command line utility:
```
cat [output file] | sqlite3 [database file]
```

## API

endpoint    | query params      | return
------------|-------------------|------------------
/data       | ?age ?gender ?fos | [{avg\_income,avg\_count}] where index represents the education level

## Database Format

### Types/Enums
Gender
    * 0 - male
    * 1 - female 
Age Group
    * 0 - 15-34
    * 1 - 35-64
Field of Study 
    * 0 - Education
    * 1 - Visual and performing arts, and communications technologies
    * 2 - Humanities
    * 3 - Social and behavioral sciences and law
    * 4 - Business, management and public administration
    * 5 - Physical and life sciences and technologies
    * 6 - Mathematics, computer and information sciences
    * 7 - Architecture, engineering, and related technologies
    * 8 - Agriculture, natural resources and conservation
    * 9 - Health and related fields
    * 10 - Personal, protective and transportation services
    * 11 - Other instructional programs
Education Level
    * 0 - Career, technical or professional training certificate
    * 1 - Career, technical or professional training diploma
    * 2 - Undergraduate degree
    * 3 - Professional degree
    * 4 - Master's degree
    * 5 - Doctoral degree

### Tables
#### GraduateGroup Table
Field      | Friendly Name     | Options
-----------|-------------------|--------------------
id         |                   | integer primary key
gender     | Gender            | integer
agegroup   | Age Group         | integer
fos        | Field of Study    | integer
education  | Education Level   | integer
count      | Group Count       | integer
income     | Median Income     | integer
datayear   | Year of the data  | integer

