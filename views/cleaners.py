from flask import Blueprint, request, jsonify, render_template
import json


dta = Blueprint('dta', __name__, url_prefix='/dta')


# @dta.route('/turf', methods=['GET', 'POST'])
# def clean_turf():
#     if request.method == 'GET':
#         # run update query, return #rex updated
#         # return unresolved cases
#         return render_template(
#             'dta_turf.html',
#             title='Clean Turf'
#         )
#
#     # POST returns cases resolved by user
#
#
# @dta.route('/dups_email', methods=['GET', 'POST'])
# def clean_emails():
#     if request.method == 'GET':
#         # return cases with dup emails
#
#     # POST resolutions


# @dta.route('/dups_phone', methods=['GET', 'POST'])
# def clean_phones():
    # if request.method == 'GET':
    #     # return cases with dup phones

    # POST resolutions


# @dta.route('/dups_name', methods=['GET', 'POST'])
# def clean_names():
#     if request.method == 'GET':
        # return cases with dup names

    # POST resolutions
