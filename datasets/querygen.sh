#!/bin/sh

## Reads datasets and generates a suitable sql query to enter it into the database

## command line arguments
# - $1 : name of csv file to be parsed
# - $2 : location of database to be outputted to

# remotes quote from string
trQuote() {
    echo "$1" | tr -d '"'
}

resolveGender() {
    case "$(trQuote "$1")" in
        Male) echo 0;;
        Female) echo 1;;
        *) echo -1;;
    esac
}

resolveAge() {
    case "$(trQuote "$1")" in
        "15-34") echo 0;;
        "35-64") echo 1;;
        *) echo -1;;
    esac
}

resolveEducation() {
    case "$(trQuote "$1")" in
        "Career, technical or professional training certificate") echo 0;;
        "Career, technical or professional training diploma") echo 1;;
        "Undergraduate degree") echo 2;;
        "Professional degree") echo 3;;
        "Master's degree") echo 4;;
        "Doctoral degree") echo 5;;
        *) echo -1;;
    esac
}

resolveFos() {
    case "$(trQuote "$1")" in
        "Education") echo 0;;
        "Visual and performing arts, and communications technologies") echo 1;;
        "Humanities") echo 2;;
        "Social and behavioral sciences and law") echo 3;;
        "Business, management and public administration") echo 4;;
        "Physical and life sciences and technologies") echo 5;;
        "Mathematics, computer and information sciences") echo 6;;
        "Architecture, engineering, and related technologies") echo 7;;
        "Agriculture, natural resources and conservation") echo 8;;
        "Health and related fields") echo 9;;
        "Personal, protective and transportation services") echo 10;;
        "Other instructional programs") echo 11;;
        *) echo -1;;
    esac
}

[ "$#" -ne 2 ] && { echo "Invalid Arguments"; exit 1; } 
[ -f "$2" ] && { echo "File already exists"; exit 1; }

echo 'INSERT INTO GraduateGroup (gender,agegroup,education,fos,datayear,count,income) VALUES' >> "$2"

while IFS='|' read -r gender age ed fos grad2010 grad2011 grad2012 grad2013 grad2014 grad2015 grad2016 wage2010 wage2011 wage2012 wage2013 wage2014 wage2015 wage2016; do
    # look into bug where first gender is -1
    rGender=`resolveGender "$gender"`
    rAge=`resolveAge "$age"`
    rEd=`resolveEducation "$ed"`
    rFos=`resolveFos "$fos"`
    # [ "$rGender" -ne -1 ] && [ "$rAge" -ne -1 ] && [ "$rEd" -ne -1 ] && [ "$rFos" -ne -1 ] || echo "invalid" 
    printf "\
($rGender,$rAge,$rEd,$rFos,2010,$grad2010,$wage2010),\n\
($rGender,$rAge,$rEd,$rFos,2011,$grad2011,$wage2011),\n\
($rGender,$rAge,$rEd,$rFos,2012,$grad2012,$wage2012),\n\
($rGender,$rAge,$rEd,$rFos,2013,$grad2013,$wage2013),\n\
($rGender,$rAge,$rEd,$rFos,2014,$grad2014,$wage2014),\n\
($rGender,$rAge,$rEd,$rFos,2015,$grad2015,$wage2015),\n\
($rGender,$rAge,$rEd,$rFos,2016,$grad2016,$wage2016),\n" >> "$2";
done < "$1"

echo ';' >> "$2"
