
import {
    Context, HandlerFunc, Group,
    BadRequestException 
} from 'https://deno.land/x/abc@v1.3.3/mod.ts';

export const dataGroup = (g: Group) => {
    g.get('/', dataEndpoint);
}

const dataEndpoint: HandlerFunc = (ctx: Context) => {
    console.log(ctx.queryParams);
    // first validate query
    if (validate(ctx.queryParams, ['age','gender','fos']) === false) {
        throw new BadRequestException();
    }
}

// simple validator to check if object has all the required fields
const validate = (obj: object, properties: string[]): boolean => {
    for (const prop in properties) {
        if (!obj.hasOwnProperty(prop)) return false;
    }
    return true;
}
