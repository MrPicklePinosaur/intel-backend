
import {
    Context, HandlerFunc, Group,
    BadRequestException 
} from 'https://deno.land/x/abc@v1.3.3/mod.ts';
import { queryGraduateGroup } from '../services/db.services.ts';

export const dataGroup = (g: Group) => {
    g.get('/', dataEndpoint);
}

const dataEndpoint: HandlerFunc = async (ctx: Context) => {
    // first validate query
    if (validateExist(ctx.queryParams, ['age','gender','fos']) === false) {
        throw new BadRequestException();
    }

    // also need to validate query argument types (later)

    const { age, gender, fos } = ctx.queryParams;
    const ageGroup = (parseInt(age) < 35) ? 0 : 1;

    let response = [];
    // retrieve income for each education group
    for (let i = 0; i <= 5; i++ ) {
        // make db request and correct invalid values
        const res = [...await queryGraduateGroup(parseInt(fos), ageGroup, parseInt(gender), i)];
        const adjustedGroupCount = adjustInvalid(res.map(row => row[5]));
        const adjustedIncome = adjustInvalid(res.map(row => row[6]));

        response.push({
            avg_income: adjustedIncome,
            avg_count: adjustedGroupCount 
        });
    }
    return response;
}

// adjusts invalid values (-1) to the average of the rest of the dataset
const adjustInvalid = (dataset: number[]) => {

    let summative = 0;     // cumulation of valid data
    let validCount = 0;
    let invalidCount = 0;

    for (const entry of dataset) {
        // invalid entry
        if (entry == -1) {
            ++invalidCount;
            continue;
        }
        summative += entry;
        ++validCount;
    }

    // handle all invalid case
    if (validCount == 0) return 0;

    // adjust income based by using -1 entries as the average
    const preAvg = summative/validCount;
    const finalAvg = (summative+preAvg*invalidCount)/(validCount+invalidCount);
    return Math.round(finalAvg);
}

// simple validator to check if object has all the required fields
const validateExist = (obj: object, properties: string[]): boolean => {
    for (const prop of properties) {
        if (!obj.hasOwnProperty(prop)) return false;
    }
    return true;
}
