import api, { route } from "@forge/api";
import Resolver from "@forge/resolver";

const resolver = new Resolver();

resolver.define("getCustomFieldContext", async (payload) => {
  try {
    const response = await api
      .asApp()
      .requestJira(
        route`/rest/api/3/app/field/${payload}/context/configuration`
      );
    if (!response.ok) {
      const message = "Error fetching data from jira api";
      console.error(message);
      return {
        isSuccess: false,
        responseData: { message },
      };
    }

    const data = await response.json();

    return { isSuccess: true, responseData: data || {} };
  } catch (error) {
    console.log(error);
    return {
      isSuccess: false,
      responseData: { message: error.message },
    };
  }
});

export const handler = resolver.getDefinitions();
