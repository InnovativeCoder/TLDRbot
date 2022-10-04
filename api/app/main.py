from flask import Flask
from flask import Flask, jsonify, request
import cohere
import time
import pandas as pd

app= Flask(__name__)
@app.route('/')
def index():
  return "<h1>Welcome to CodingX</h1>"

co = cohere.Client("OUT3PrgQY3ce9r58AGlbOinlfRbVGSCU6Yh3Akht")

@app.route('/notes', methods=['GET','POST'])
def notes_gen():
    if request.method == 'POST':
      print("request is")
      prompt = request.get_json()["message"]

      n_generations = 1

      prediction = co.generate(
          model='large',
          prompt=prompt,
          return_likelihoods = 'GENERATION',
          stop_sequences=['"'],
          max_tokens=50,
          temperature=0.7,
          num_generations=n_generations,
          k=0,
          p=0.75)

      # Get list of generations
      gens = []
      likelihoods = []
      for gen in prediction.generations:
          gens.append(gen.text)
          
          sum_likelihood = 0
          for t in gen.token_likelihoods:
              sum_likelihood += t.likelihood
          # Get sum of likelihoods
          likelihoods.append(sum_likelihood)

      pd.options.display.max_colwidth = 200
      # Create a dataframe for the generated sentences and their likelihood scores
      df = pd.DataFrame({'generation':gens, 'likelihood': likelihoods})
      # Drop duplicates
      df = df.drop_duplicates(subset=['generation'])
      # Sort by highest sum likelihood
      df = df.sort_values('likelihood', ascending=False, ignore_index=True)
      print("response be like")
    else:
      return "<h1>Welcome to club</h1>"
      
    return jsonify(summary=df['generation'][0])
