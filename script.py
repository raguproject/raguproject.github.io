import pandas as pd
import numpy as np
import json
import string

METADATI_FILE = 'ragu_disci - metadati.tsv'
VOCAB_FILE = 'ragu_disci - vocabolari.tsv'

def clean_whitespace(string):
    # to clean from whitespaces
    clean = ' '.join(string.strip().split())
    return clean


def name_for_file(name):
    new_name = name.replace(' ', '_')
    return new_name.lower()


def read_json(file_name):
    with open(file_name) as j:
        data = json.load(j)
        return data


def update_json(file_name, new_data):
    with open(file_name, 'w') as j:
        json.dump(new_data, j, indent=4)


# alphabetic order of recipes
alphabet_dict = {}
alphabet = list(string.ascii_lowercase)
for letter in alphabet:
    alphabet_dict[letter] = {}

# vocabularies
vocab_df = pd.read_csv(VOCAB_FILE, sep='\t')

# ingredients and categories
cat_vocab_df = vocab_df[['Ingredient', 'Category']]
cat_vocab_df = cat_vocab_df.replace(np.nan, '?', regex=True)
# group by ingredient category
unique_cat = cat_vocab_df.Category.unique()
grouped_cat = cat_vocab_df.groupby(cat_vocab_df.Category)
vocab_dict = {}
for c in unique_cat:
    df_cat = grouped_cat.get_group(c)
    vocab_dict[c.strip()] = list(df_cat.Ingredient)

# unique ingredients
ingredient_list = cat_vocab_df.Ingredient.dropna().unique()
ingredient_dict = {}
for ing in ingredient_list:
    ingredient_dict[ing.lower().strip()] = []

# course
course_type = vocab_df['Course type'].dropna().unique()
course_type_dict = {}
for type in course_type:
    course_type_dict[type.lower()] = []

# group by provenance town
unique_town = vocab_df.Town.dropna().unique()
towns_dict = {}
for town in unique_town:
    towns_dict[town] = []

# unique unit of measure
measures_list = vocab_df['Unit of measure'].dropna().unique()
measure_dict = {}
for m in measures_list:
    measure_dict[m.strip().lower()] = 0

# empty dict for matrix
matrix_data = {}

# create dataframe
total_df = pd.read_csv(METADATI_FILE, sep='\t')
# drop first row
total_df.drop(index=total_df.index[0], axis=0, inplace=True)
# clean header names
total_df = total_df.rename(columns=lambda s: s.replace('  ', ' '))
# clean nan
total_df = total_df.replace(np.nan, '', regex=True)
# get unique folder names
unique_folders = total_df.Folder.dropna().unique()
# group dataframe by Folder
grouped_folders = total_df.groupby(total_df.Folder)
# open general json
general_update = read_json('json/general.json')
# empty dict for notebooks
notebooks_dict = {}
for f in unique_folders:
    # folder info location
    clean_name = name_for_file(clean_whitespace(f))
    file_name = clean_name + '.json'
    notebooks_dict[clean_name] = file_name

    # get from dataframe data for specific folder f
    df_folder = grouped_folders.get_group(f)

    # general folder info
    folder_info = {
        'id': clean_name,
        'notebookTitle': df_folder['Notebook'].iloc[0],
        'fromYear': df_folder['From'].iloc[0],
        'toYear': df_folder['To'].iloc[0],
        'timeQualifier': df_folder['Time qualifier'].iloc[0],
        'author': df_folder['Author'].iloc[0]
    }

    # provenance info
    provenance = {
        'city': df_folder['Place'].iloc[0],
        'region': df_folder['Region'].iloc[0],
        'country': df_folder['Country'].iloc[0],
        'dateOfFinding': df_folder['Date of finding'].iloc[0],
        'placeOfFinding': df_folder['Where it was found'].iloc[0],
        'donor': df_folder['Who donated it'].iloc[0],
        'foundBy': df_folder['Who found it'].iloc[0]
    }
    folder_info['provenance'] = provenance

    # recipes
    recipes = {}
    # get unique recipes names per folder
    unique_recipes = df_folder['Title Recipe'].unique()
    print(f, df_folder.groupby(['Title Recipe', 'Img']))

    counter = 0

    for recipe in unique_recipes:
        counter = counter + 1
        recipe_number = str(counter).zfill(3)
        recipe_name = ''
        if recipe == '':
            recipe_name = 'unknown title'
        else:
            recipe_name = recipe

        # group dataframe by recipe
        grouped_recipes = df_folder.groupby(df_folder['Title Recipe'])
        df_recipe = grouped_recipes.get_group(recipe)
        recipe_id = name_for_file(clean_whitespace(
            recipe_name)) + '_' + recipe_number

        recipe_course = clean_whitespace(df_recipe['Course'].iloc[0]).lower()
        # general info
        recipe_info = {
            'id': recipe_id,
            'img': df_recipe['Img'].iloc[0].split('; '),
            'recipeTitle': recipe_name,
            'numberOfPersons': df_recipe['Num. persons'].iloc[0].split(';'),
            'pagesNumber': df_recipe['Pag.'].iloc[0].split(';'),
            'chapter': clean_whitespace(df_recipe['Title chapter'].iloc[0]),
            'course': recipe_course,
            'sideDish': df_recipe['Side dishes'].iloc[0].split(';'),
            'cookingProcedure': list(df_recipe.Procedure.unique()),
            'temperature': list(df_recipe.Temperature.unique()),
            'recipeTime': list(df_recipe['Recipe time'].unique()),
            'cookingTime': list(df_recipe['Cooking time'].unique())
        }

        # update alphabetic file
        first_letter = recipe_name[0].lower()
        if first_letter in alphabet:  # to be changed, it currently ignores all cases where the title does not begin with a letter
            letter_dict = alphabet_dict[first_letter]
            letter_dict[clean_name + '__' + recipe_number] = recipe_name + \
                ' (' + df_folder['Author'].iloc[0] + ')'

            # add to alphabet dictionary in sorted order
            alphabet_dict[first_letter] = dict(
                sorted(letter_dict.items(), key=lambda x: x[1]))

        # update course type file
        if len(recipe_course) > 0:
            course_list = course_type_dict[recipe_course]
            course_list.append(clean_name + '__' + recipe_number)
            course_type_dict[recipe_course] = course_list

        # update provenance file
        provenance_town = df_recipe['Place'].iloc[0]
        if len(provenance_town) > 0:
            town_list = towns_dict[provenance_town]
            town_list.append(clean_name + '__' + recipe_number)
            towns_dict[provenance_town] = town_list

        matrix_ingredients = set()

        # ingredients
        ingredients = []

        for i, j in df_recipe.iterrows():
            ingredient_category = 'unknown category'
            # search ingredient category in vocabulary
            for k, v in vocab_dict.items():
                if df_recipe.loc[i]['Ingredient'] in v:
                    ingredient_category = k.strip()
            ingredient_name = df_recipe.loc[i]['Ingredient'].strip()
            # add to matrix set of ingredients
            matrix_ingredients.add(ingredient_category)

            if len(ingredient_name) > 0:
                alternative_ingredient_list = [
                    {
                        'alternativeIngredientName': df_recipe.loc[i]['Alternative ingredient'],
                        'alternativeIngredientVariantName': df_recipe.loc[i]['Alternative ingredient variant name'],
                        'alternativeIngredientQualifier': df_recipe.loc[i]['Alternative ingredient qualifier']
                    }
                ]

                # update unit of measure count
                unit_of_measure = df_recipe.loc[i]['Unit of measure'].strip(
                ).lower()
                if len(unit_of_measure) > 0:
                    measure_dict[unit_of_measure] = measure_dict[unit_of_measure] + 1

                ingredient_info = {
                    'category': ingredient_category,
                    'ingredientName': ingredient_name,
                    'ingredientQualifier': df_recipe.loc[i]['Ingredient qualifier'],
                    'variantIngredientName': df_recipe.loc[i]['Ingredient variant name'],
                    'dosage': {
                        'quantity': df_recipe.loc[i]['Dosage'],
                        'unitOfMeasure': unit_of_measure
                    },
                    'alternativeIngredient': alternative_ingredient_list
                }
                ingredients.append(ingredient_info)
                # update ingredients file
                recipe_per_ingredient = ingredient_dict[ingredient_name.lower(
                )]
                recipe_per_ingredient.append(clean_name + '__' + recipe_number)
                ingredient_dict[ingredient_name.lower()
                                ] = recipe_per_ingredient
            # same ingredient with another alternate name (on hold)
            # elif len(ingredient_name) == 0 and len(df_recipe.loc[i]['Alternative ingredient']) > 0:
            #     alternative_ingredient_info = {
            #         'alternativeIngredientName': df_recipe.loc[i]['Alternative ingredient'],
            #         'alternativeIngredientVariantName': df_recipe.loc[i]['Alternative ingredient variant name'],
            #         'alternativeIngredientQualifier': df_recipe.loc[i]['Alternative ingredient qualifier']
            #     }

        recipe_info['ingredients'] = ingredients
        recipes[recipe_number] = recipe_info

        # update matrix
        matrix_data[recipe_id] = list(matrix_ingredients)

    folder_info['recipes'] = recipes
    update_json('json/'+file_name, folder_info)

# add notebooks to json data
general_update['notebooks'] = notebooks_dict

# add counters
recipes_number = 0
for recipe_list in alphabet_dict.values():
    recipes_number = recipes_number + len(recipe_list)

counter_values = {
    'cookbooks': len(unique_folders),
    'recipes': recipes_number,
    'ingredients': len(ingredient_list)
}
general_update['counter'] = counter_values

# update general json
update_json('json/general.json', general_update)

# update alphabetic list
# open file
alphabetic_list = read_json('json/alphabet.json')
# update file
alphabetic_list = alphabet_dict
update_json('json/alphabet.json', alphabetic_list)

# update course type list
# open file
course_type_file = read_json('json/categories.json')
# update file
course_type_file = course_type_dict
update_json('json/categories.json', course_type_file)

update_json('json/ingredients.json', ingredient_dict)

update_json('json/provenance.json', towns_dict)

measure_list_dict = []
for m, count in measure_dict.items():
    m_count_dict = {}
    m_count_dict['value'] = count
    m_count_dict['category'] = m
    measure_list_dict.append(m_count_dict)
update_json('json/piechart.json', measure_list_dict)

update_json('json/matrix.json', matrix_data)

# network
network_list = read_json('json/network.json')
network_data = {
    'name': 'ingredients',
    'children': []
}

for cat, ingredients in vocab_dict.items():
    cat_dict = {}
    cat_dict['name'] = cat
    cat_ingr_list = []
    for ingr in ingredients:
        ingredient_count = {}
        ingredient_count['name'] = ingr.strip().lower()
        ingredient_count['value'] = len(ingredient_dict[ingr.strip().lower()])
        cat_ingr_list.append(ingredient_count)
    cat_dict['children'] = cat_ingr_list
    network_data['children'].append(cat_dict)
network_list.append(network_data)
update_json('json/network.json', network_list)

# map
map_data = []
for town, value_list in towns_dict.items():
    town_count = {}
    town_count['title'] = town
    town_count['value'] = len(value_list)
    map_data.append(town_count)
update_json('json/map.json', map_data)
